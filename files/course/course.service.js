const { queryConstructor } = require("../../utils")
const { CourseFailure, CourseSuccess } = require("./course.messages")
const { CourseRepository } = require("./course.repository")
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
const { sendMailNotification } = require("../../utils/email")

class CourseService {
  static async createCourse(payload, locals) {
    const { image, body } = payload

    const course = await CourseRepository.create({
      ...body,
      courseCover: image,
      createdBy: new mongoose.Types.ObjectId(locals._id),
    })

    if (!course) return { success: false, msg: CourseFailure.CREATE }

    try {
      await NotificationRepository.createNotification({
        recipientId: new mongoose.Types.ObjectId(locals._id),
        recipient: "Super-Admin",
        title: "Course Created",
        message: `You have successfully created a course - ${body.title}`,
      })
    } catch (error) {
      console.log("notification error", error)
    }
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

      if (!admin) {
        return { success: false, msg: `Invalid adminId` }
      }

      const instructorCourse = await CourseRepository.fetchOne({
        _id: new mongoose.Types.ObjectId(admin.courseId),
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
      isDelete: false,
      limit,
      skip,
      sort,
    })

    if (course.length < 1)
      return { success: true, msg: CourseFailure.FETCH, data: [] }

    return {
      success: true,
      msg: CourseSuccess.FETCH,
      data: course,
    }
  }

  static async getSingleModule(payload) {
    const { courseId, moduleId } = payload
    const course = await CourseRepository.fetchOne({
      _id: new mongoose.Types.ObjectId(courseId),
    })

    if (!course) return { success: true, msg: CourseFailure.FETCH, data: [] }

    // Find the module within the course by its ID
    const courseModule = course.modules.find(
      (m) => m._id.toString() === moduleId
    )

    if (!courseModule)
      return { success: true, msg: `module not available`, data: [] }

    return {
      success: true,
      msg: `Module fetched  successfully `,
      data: courseModule,
    }
  }

  static async updateCourse(payload, locals) {
    const { image, body } = payload
    const course = await CourseRepository.updateCourseDetails(
      { _id: new mongoose.Types.ObjectId(locals) },
      { ...body, courseCover: image }
    )

    if (!course) return { success: false, msg: CourseFailure.UPDATE }

    return { success: true, msg: CourseSuccess.UPDATE, data: course }
  }

  static async softDeleteCourse(courseParams) {
    const course = await CourseRepository.updateCourseDetails(
      { _id: new mongoose.Types.ObjectId(courseParams) },
      { isDelete: true }
    )

    if (!course)
      return {
        success: false,
        msg: `Unable to delete course or likely courseId`,
      }

    return { success: true, msg: `Course deleted successfully` }
  }

  //student course enrollment
  static async studentCourseEnrollment(payload, locals) {
    const validateCourse = await CourseRepository.fetchOne({
      _id: new mongoose.Types.ObjectId(payload),
    })

    if (!validateCourse)
      return { success: false, msg: `Invalid course Id for enrollment` }

    // Get current date
    const currentDate = new Date()

    const validateSubscription = await SubscriptionRepository.fetchOne({
      userId: new mongoose.Types.ObjectId(locals._id),
      status: "active",
      expiresAt: { $gt: currentDate },
    })

    if (!validateSubscription)
      return {
        return: false,
        msg: `User have no valid subscription, kindly subscribe`,
      }

    //validate if student is enrolled
    const user = await UserRepository.findSingleUserWithParams({
      _id: new mongoose.Types.ObjectId(locals._id),
      enrollmentStatus: "active",
    })

    if (user)
      return { success: false, msg: `User already enrolled in a course` }

    const updateUserCourse = await UserRepository.updateUserDetails(
      {
        _id: new mongoose.Types.ObjectId(locals._id),
      },
      {
        courseId: new mongoose.Types.ObjectId(validateCourse._id),
        enrollmentStatus: "active",
      }
    )

    if (!updateUserCourse)
      return { success: false, msg: `Unable to enroll user's course` }

    return { success: true, msg: `Course enrollment successful` }
  }

  //list of course student
  static async courseStudent(payload) {
    const course = await CourseRepository.fetchOne({
      _id: new mongoose.Types.ObjectId(payload),
    })

    if (!course)
      return {
        success: false,
        msg: `Invalid course Id`,
      }

    const student = await UserRepository.findAllUsersParams({
      courseId: new mongoose.Types.ObjectId(course._id),
    })

    if (!student)
      return {
        success: true,
        msg: `No available student for your course`,
        data: [],
      }

    return { success: true, msg: CourseSuccess.FETCH, data: student }
  }

  //user enrolled course
  static async userEnrolledCourse(payload) {
    const user = await UserRepository.findSingleUserWithParams({
      _id: new mongoose.Types.ObjectId(payload),
    })

    if (!user) return { success: false, msg: `Invalid User` }

    const course = await CourseRepository.fetchOne({
      _id: new mongoose.Types.ObjectId(user.courseId),
    })

    if (!course)
      return {
        success: false,
        msg: `User currently has not active course`,
      }

    return { success: true, msg: CourseSuccess.FETCH, data: course }
  }
}

module.exports = { CourseService }
