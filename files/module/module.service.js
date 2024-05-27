const { queryConstructor } = require("../../utils")
const { ModuleFailure, ModuleSuccess } = require("./module.messages")
const { ModuleRepository } = require("./module.repository")
const mongoose = require("mongoose")
const { AdminRepository } = require("../admin/admin.repository")
const {
  SubscriptionRepository,
} = require("../subscription/subscription.repository")
const { UserRepository } = require("../user/user.repository")
const {
  AssessmentRecordRepository,
} = require("../assessment_record/assessmentRecord.repository")
const {
  NotificationRepository,
} = require("../notification/notification.repository")
const { videoChunkUpload } = require("../../utils/multer")
const { CourseRepository } = require("../course/course.repository")

class ModuleService {
  static async createModule(payload, locals) {
    const { body } = payload
    const { courseId } = body

    if (!courseId) return { success: false, msg: `courseId not found` }

    const module = await ModuleRepository.create({
      ...body,
      courseId: new mongoose.Types.ObjectId(courseId),
      createdBy: new mongoose.Types.ObjectId(locals._id),
    })

    if (!module) return { success: false, msg: ModuleFailure.CREATE }

    //get course and update the module
    await CourseRepository.updateCourseDetails(
      {
        _id: new mongoose.Types.ObjectId(courseId),
      },
      {
        $push: {
          modules: new mongoose.Types.ObjectId(module._id),
        },
      }
    )

    try {
      await NotificationRepository.createNotification({
        recipient: "Super-Admin",
        title: "Module",
        message: `A module has been added by instructor: ${locals.firstName} ${locals.lastName} `,
      })
    } catch (error) {
      console.log("notification error", error)
    }
    return { success: true, msg: ModuleSuccess.CREATE, data: module }
  }

  static async getModule(payload, locals) {
    const { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "Module"
    )
    if (error) return { success: false, msg: error }
    let extra = {}
    if (locals.courseId && locals.role === "instructor") {
      const admin = await AdminRepository.fetchAdmin({
        _id: new mongoose.Types.ObjectId(locals._id),
      })

      if (!admin) return { success: false, msg: `Invalid admin` }

      extra = { courseId: new mongoose.Types.ObjectId(locals.courseId) }
    }

    const module = await ModuleRepository.findAllCourseParams({
      ...params,
      ...extra,
      isDeleted: false,
      limit,
      skip,
      sort,
    })

    if (module.length < 1)
      return { success: true, msg: ModuleFailure.FETCH, data: [] }

    return {
      success: true,
      msg: ModuleSuccess.FETCH,
      data: module,
    }
  }

  static async getSingleModule(payload) {
    const { moduleId } = payload
    const module = await ModuleRepository.fetchOne({
      _id: new mongoose.Types.ObjectId(moduleId),
    })

    if (!module) return { success: true, msg: ModuleFailure.FETCH, data: [] }

    return {
      success: true,
      msg: `Module fetched  successfully `,
      data: module,
    }
  }

  static async updateModule(payload, params) {
    const { body } = payload
    const module = await ModuleRepository.updateCourseDetails(
      { _id: new mongoose.Types.ObjectId(params) },
      { ...body }
    )

    if (!module) return { success: false, msg: ModuleFailure.UPDATE }

    return { success: true, msg: ModuleSuccess.UPDATE }
  }

  static async addModuleLesson(payload, params) {
    const { body } = payload
    let moduleVideo
    if (payload && payload.file) {
      moduleVideo = await videoChunkUpload("moduleVideo", payload)
    }
    const module = await ModuleRepository.updateCourseDetails(
      { _id: new mongoose.Types.ObjectId(params) },
      {
        $addToSet: {
          lessons: {
            title: body.title,
            note: body.note,
            video: moduleVideo,
          },
        },
      }
    )

    if (!module)
      return { success: false, msg: `Module lesson added successfully` }

    return {
      success: true,
      msg: `Module lesson added successfully`,
      lessonId: module.lessons.slice(-1)[0]._id,
      data: module,
    }
  }

  static async uploadLessonVideo(payload, lessonId) {
    if (!payload.file) {
      return { success: false, msg: "Only video for lesson is allowed" }
    }

    let moduleVideo
    if (payload && payload.file) {
      moduleVideo = await videoChunkUpload("moduleVideo", payload)
    }
    console.log("moduleVideo", moduleVideo)
    if (!moduleVideo) {
      return {
        success: false,
        msg: "Failed to upload the video or like network issue",
      }
    }
    // Update the lesson video in the module lesson
    const updateResult = await ModuleRepository.updateCourseDetails(
      { "lessons._id": lessonId },
      {
        $set: {
          "lessons.$.video": moduleVideo,
        },
      }
    )
    if (!updateResult)
      return {
        success: false,
        msg: `Unable to add lesson video or possibly  wrong  lessonId`,
      }

    return { success: true, msg: `Lesson video added successfully` }
  }
}

module.exports = { ModuleService }
