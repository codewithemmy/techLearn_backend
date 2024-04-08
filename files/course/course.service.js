const { queryConstructor } = require("../../utils")
const { CourseFailure, CourseSuccess } = require("./course.messages")
const { CourseRepository } = require("./course.repository")
const mongoose = require("mongoose")
const { AdminRepository } = require("../admin/admin.repository")

class CourseService {
  static async createCourse(payload, locals) {
    const { image, body } = payload

    const course = await CourseRepository.create({
      ...body,
      image,
      createdBy: new mongoose.Types.ObjectId(locals._id),
    })

    if (!course) return { success: false, msg: CourseFailure.CREATE }

    return { success: true, msg: CourseSuccess.CREATE, data: course }
  }

  static async getCourse(payload, locals) {
    const { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "Course"
    )
    if (error) return { success: false, msg: error }

    let extra = {}
    if (locals.role === "instructor") {
      const admin = await AdminRepository.fetchAdmin({
        _id: new mongoose.Types.ObjectId(locals._id),
      })

      const instructorCourse = await CourseRepository.fetchOne({
        _id: admin.courseId,
      })

      if (!instructorCourse)
        return {
          success: false,
          msg: `Current instructor has no course assigned`,
        }

      extra = { _id: new mongoose.Types.ObjectId(instructorCourse._id) }
    }

    const course = await CourseRepository.findAllCourseParams({
      ...params,
      ...extra,
      limit,
      skip,
      sort,
    })

    if (!course) return { success: true, msg: CourseFailure.FETCH, data: [] }

    return {
      success: true,
      msg: CourseSuccess.FETCH,
      data: course,
    }
  }

  static async updateCourse(payload, locals) {
    const { image, body } = payload
    const course = await CourseRepository.updateCourseDetails(
      { _id: new mongoose.Types.ObjectId(locals) },
      {
        $push: { modules: { ...body, video: image } },
      }
    )

    if (!course) return { success: false, msg: CourseFailure.UPDATE }

    return { success: true, msg: CourseSuccess.UPDATE, data: course }
  }

  //update modules
  static async updateCourseModule(payload, moduleId) {
    // 6606cd43d5ed1a4ae37005a4
    const { image, body } = payload

    const course = await CourseRepository.updateCourseDetails(
      { "modules._id": moduleId },
      {
        $set: {
          "modules.$.module": body.module,
          "modules.$.overview": body.overview,
          "modules.$.lessonNoteTitle": body.lessonNoteTitle,
          "modules.$.lessonNoteContent": body.lessonNoteContent,
          "modules.$.assessmentInstruction": body.assessmentInstruction,
          "modules.$.assessment": body.assessment,
          "modules.$.video": image,
        },
      }
    )

    if (!course)
      return {
        success: false,
        msg: `Unable to update or possibly  wrong  module id`,
      }

    return { success: true, msg: CourseSuccess.UPDATE, data: course }
  }

  //update modules assessment
  static async updateModuleAssessment(payload, moduleId) {
    const { question, options, answer } = payload

    const course = await CourseRepository.updateCourseDetails(
      { "modules._id": moduleId },
      { $push: { "modules.0.assessment": { question, options, answer } } }
    )

    if (!course)
      return {
        success: false,
        msg: `Unable to update or possibly  wrong  module id`,
      }

    return { success: true, msg: CourseSuccess.UPDATE, data: course }
  }
}

module.exports = { CourseService }
