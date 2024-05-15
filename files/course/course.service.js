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
const { videoChunkUpload } = require("../../utils/multer")

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
        recipient: "Admin",
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

    // if (!locals.isAdmin) {
    //   const user = await UserRepository.findSingleUserWithParams({
    //     _id: new mongoose.Types.ObjectId(locals._id),
    //   })

    //   extra = { _id: new mongoose.Types.ObjectId(user.courseId) }
    // }

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

  //update modules
  static async updateCourseModule(payload, moduleId) {
    const { body } = payload
    const moduleVideo = await videoChunkUpload("moduleVideo", payload)

    const course = await CourseRepository.updateCourseDetails(
      { "modules._id": moduleId },
      {
        $set: {
          "modules.$.module": body.module,
          "modules.$.moduleNumber": body.moduleNumber,
          "modules.$.overview": body.overview,
          "modules.$.lessonNoteTitle": body.lessonNoteTitle,
          "modules.$.lessonNoteContent": body.lessonNoteContent,
          "modules.$.assessmentInstruction": body.assessmentInstruction,
          "modules.$.assessment": body.assessment,
          "modules.$.video": moduleVideo,
        },
      }
    )

    if (!course)
      return {
        success: false,
        msg: `Unable to update or possibly  wrong  module id`,
      }

    return { success: true, msg: CourseSuccess.UPDATE }
  }

  //update modules
  static async updateModule(payload, courseId) {
   const { body } = payload
   const moduleVideo = await videoChunkUpload("moduleVideo", payload)
    const course = await CourseRepository.updateCourseDetails(
      { _id: new mongoose.Types.ObjectId(courseId) },
      {
        $addToSet: {
          modules: {
            module: body.module,
            moduleNumber: body.moduleNumber,
            lessonNoteTitle: body.lessonNoteTitle,
            lessonNoteContent: body.lessonNoteContent,
            assessmentInstruction: body.assessmentInstruction,
            assessment: body.assessment,
            video: moduleVideo,
          },
        },
      }
    )
    if (!course)
      return {
        success: false,
        msg: `Unable to update or possibly  wrong  module id`,
      }

    return { success: true, msg: `Module updated successfully` }
  }

  //update modules assessment
  static async updateModuleAssessment(payload, moduleId) {
    const { question, options, answer } = payload

    const course = await CourseRepository.updateCourseDetails(
      { "modules._id": moduleId },
      { $push: { "modules.$.assessment": { question, options, answer } } }
    )

    if (!course)
      return {
        success: false,
        msg: `Unable to update or possibly  wrong  module id`,
      }

    return { success: true, msg: CourseSuccess.UPDATE, data: course }
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

  //user virtual class request code
  static async virtualClassRequest(payload) {
    const user = await UserRepository.findSingleUserWithParams({
      _id: new mongoose.Types.ObjectId(payload),
    })

    if (!user) return { success: false, msg: `Invalid User` }

    //check user type
    if (user.userType !== "premium")
      return {
        success: false,
        msg: `Only premium users are allowed to request for a virtual class link`,
      }

    const course = await CourseRepository.fetchOne({
      _id: new mongoose.Types.ObjectId(user.courseId),
    })

    if (!course)
      return {
        success: false,
        msg: `User currently has not active course`,
      }

    //get course instructor
    const instructor = await AdminRepository.fetchAdmin({
      courseId: new mongoose.Types.ObjectId(course._id),
    })

    if (!instructor)
      return { success: false, msg: `Instructor for course not available` }

    try {
      await NotificationRepository.createNotification({
        recipientId: new mongoose.Types.ObjectId(instructor._id),
        recipient: "Admin",
        title: "Course Code Request",
        message: `Hello ${instructor.firstName} - Your student: ${user.firstName} is requesting to join your class. Kindly revert `,
      })
    } catch (error) {
      console.log("notification error", error)
    }

    return { success: true, msg: `Virtual class request successful sent` }
  }

  //module assessment or test
  static async moduleAssessmentTest(payload, locals) {
    const { courseId, moduleId, answer } = payload

    const course = await CourseRepository.fetchOne({
      _id: new mongoose.Types.ObjectId(courseId),
      "modules._id": moduleId,
    })

    if (!course)
      return {
        success: false,
        msg: `Invalid course or module Id`,
      }

    const courseModule = course.modules.find(
      (module) => module._id.toString() === moduleId
    )
    if (!courseModule)
      return { success: false, msg: `Invalid course module Id` }

    // Map only the assessment array from the module and console.log it
    const assessmentArray = courseModule.assessment.map((question) => question)
    // Initialize an empty array to store the results
    let result = 0
    let assessmentLength = 0
    // Iterate through both arrays and compare elements
    answer.forEach((payloadAnswer, index) => {
      // Compare the payload answer with the corresponding assessment answer
      if (payloadAnswer === assessmentArray[index].answer) {
        assessmentLength += 1
        let scorePercentage = (assessmentLength / answer.length) * 100
        result = scorePercentage
      }
    })

    let assessmentRecord
    const confirmAssessmentRecord = await AssessmentRecordRepository.fetchOne({
      moduleId,
      moduleTitle: course.modules.module,
      userId: new mongoose.Types.ObjectId(locals),
      courseId: new mongoose.Types.ObjectId(courseId),
    })

    if (!confirmAssessmentRecord) {
      assessmentRecord = await AssessmentRecordRepository.create({
        moduleId,
        moduleTitle: course.modules.module,
        courseId: new mongoose.Types.ObjectId(courseId),
        userId: new mongoose.Types.ObjectId(locals),
        score: result,
        grade: result < 50 ? "failed" : "success",
      })

      if (!assessmentRecord._id)
        return { success: false, msg: `Unable to get assessment result` }
    } else {
      assessmentRecord =
        await AssessmentRecordRepository.updateAssessmentRecordDetails(
          { userId: new mongoose.Types.ObjectId(locals) },
          {
            moduleId,
            courseId: new mongoose.Types.ObjectId(courseId),
            userId: new mongoose.Types.ObjectId(locals),
            score: result,
            grade: result < 50 ? "failed" : "success",
          }
        )
    }

    return {
      success: true,
      msg: CourseSuccess.UPDATE,
      data: { result, grade: assessmentRecord.grade },
    }
  }
}

module.exports = { CourseService }
