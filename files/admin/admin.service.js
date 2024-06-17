const mongoose = require("mongoose")
const { AdminRepository } = require("./admin.repository")
const {
  hashPassword,
  verifyPassword,
  tokenHandler,
  queryConstructor,
} = require("../../utils/index")
const { authMessages } = require("./messages/auth.messages")
const { adminMessages } = require("./messages/admin.messages")
const { UserRepository } = require("../user/user.repository")
const { sendMailNotification } = require("../../utils/email")
const {
  TransactionRepository,
} = require("../transaction/transaction.repository")
const { CourseRepository } = require("../../files/course/course.repository")
const {
  NotificationRepository,
} = require("../notification/notification.repository")
const { TextRepository } = require("../messages/texts/text.repository")
const {
  ConversationRepository,
} = require("../messages/conversations/conversation.repository")

class AdminAuthService {
  static async adminSignUpService(body) {
    const admin = await AdminRepository.fetchAdmin({
      email: body.email,
    })

    if (admin) {
      return { success: false, msg: authMessages.ADMIN_EXISTS }
    }

    if (body.role === "instructor" && !body.courseId)
      return {
        success: false,
        msg: `Instructor cannot be added without a course`,
      }

    const password = await hashPassword(body.password)
    const signUp = await AdminRepository.create({
      ...body,
      courseId: new mongoose.Types.ObjectId(body.courseId),
      password,
    })

    if (!signUp._id)
      return { success: false, msg: authMessages.ADMIN_NOT_CREATED }

    //create course chat or conversation group
    if (body.role === "instructor") {
      const conversation = await ConversationRepository.createConversation({
        courseId: new mongoose.Types.ObjectId(body.courseId),
        instructorId: new mongoose.Types.ObjectId(signUp._id),
      })

      const text = await TextRepository.createText({
        senderId: new mongoose.Types.ObjectId(signUp._id),
        sender: "Admin",
        conversationId: new mongoose.Types.ObjectId(conversation._id),
        message: `Hello! Welcome to the chat group`,
        courseId: new mongoose.Types.ObjectId(body.courseId),
      })
    }

    try {
      await NotificationRepository.createNotification({
        recipientId: new mongoose.Types.ObjectId(signUp._id),
        recipient: "Admin",
        title: "Instructor Account",
        message: `Congratulations, you a now a certified instructor for a course on
          Intellio Academy`,
      })

      const substitutional_parameters = {
        name: body.firstName,
        email: body.email,
        password: body.password,
      }

      await sendMailNotification(
        body.email,
        "Instructor Role",
        substitutional_parameters,
        "INSTRUCTOR_ROLE"
      )
    } catch (error) {
      console.log("error", error)
    }

    return { success: true, msg: authMessages.ADMIN_CREATED }
  }

  static async adminLoginService(body) {
    const admin = await AdminRepository.fetchAdmin({
      email: body.email,
    })

    if (!admin)
      return {
        success: false,
        msg: authMessages.LOGIN_ERROR,
      }

    const passwordCheck = await verifyPassword(body.password, admin.password)

    if (!passwordCheck) {
      return { success: false, msg: authMessages.LOGIN_ERROR }
    }

    const token = await tokenHandler({
      _id: admin._id,
      email: admin.email,
      accountType: admin.accountType,
      accountType: admin.accountType,
      courseId: admin.courseId,
      status: admin.status,
      role: admin.role,
      isAdmin: true,
    })

    admin.password = undefined
    // admin.password = undefined
    return {
      success: true,
      msg: authMessages.ADMIN_FOUND,
      data: {
        _id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        accountType: admin.accountType,
        status: admin.status,
        role: admin.role,
        ...token,
      },
    }
  }

  static async getAdminService(adminPayload) {
    const { error, params, limit, skip, sort } = queryConstructor(
      adminPayload,
      "createdAt",
      "Admin"
    )
    if (error) return { success: false, msg: error }

    let getAdmin = await AdminRepository.findAdminParams({
      ...params,
      limit,
      skip,
      sort,
    })

    if (getAdmin.length < 1)
      return { success: false, msg: authMessages.ADMIN_NOT_FOUND }
    let newAdminData = []
    if (params.role === "instructor") {
      // Iterate over each admin document
      for (const admin of getAdmin) {
        // Count users with matching courseId
        let standardStudent = await UserRepository.countUser({
          courseId: admin.courseId,
          userType: "standard",
        })

        let premiumStudent = await UserRepository.countUser({
          courseId: admin.courseId,
          userType: "premium",
        })
        newAdminData.push({
          ...admin._doc,
          currentStudent: `${standardStudent} standard & ${premiumStudent} premium student`,
        })
      }

      return {
        success: true,
        msg: authMessages.ADMIN_FOUND,
        data: newAdminData,
        count: newAdminData.length,
      }
    }

    return {
      success: true,
      msg: authMessages.ADMIN_FOUND,
      data: getAdmin,
      count: getAdmin.length,
    }
  }

  static async updateAdminService(data, id) {
    const { body, image } = data
    delete body.email
    const admin = await AdminRepository.updateAdminDetails(
      { _id: new mongoose.Types.ObjectId(id) },
      { ...body, profileImage: image }
    )

    delete admin.password

    if (!admin)
      return {
        success: false,
        msg: adminMessages.UPDATE_PROFILE_FAILURE,
      }

    return {
      success: true,
      msg: adminMessages.UPDATE_PROFILE_SUCCESS,
    }
  }

  static async getLoggedInAdminService(adminPayload) {
    const { _id } = adminPayload
    const getAdmin = await AdminRepository.fetchAdmin({
      _id: new mongoose.Types.ObjectId(_id),
    })

    if (!getAdmin) return { success: false, msg: authMessages.ADMIN_NOT_FOUND }

    getAdmin.password = undefined

    return { success: true, msg: authMessages.ADMIN_FOUND, data: getAdmin }
  }

  static async dashboardAnalysisService(query) {
    const { from, to } = query
    let extra = {}
    if (from && to) {
      let start = new Date(from)
      let end = new Date(to)
      end.setHours(0, 0, 0, 0)
      extra = {
        createdAt: {
          $gte: start,
          $lte: new Date(end.getTime() + 24 * 60 * 60 * 1000),
        },
      }
    }

    const revenue = await TransactionRepository.fetchTransactionsByParams({
      status: "confirmed",
      ...extra,
    })

    const instructor = await AdminRepository.findAdminParams({
      role: "instructor",
    })

    const user = await UserRepository.findAllUsersParams({ ...extra })

    if (revenue.length < 1)
      return { success: true, msg: `Revenue not currently available`, date: [] }

    if (user.length < 1)
      return { success: true, msg: `Users not currently available`, date: [] }

    let totalRevenue = revenue.reduce((total, totalAmount) => {
      return total + totalAmount.amount
    }, 0)

    let premiumPlan = revenue.filter((result) => {
      return result.subscriptionPlanId.planType === "premium"
    })

    let premiumProfit = premiumPlan.reduce((total, totalAmount) => {
      return total + totalAmount.amount
    }, 0)

    let standardPlan = revenue.filter((result) => {
      return result.subscriptionPlanId.planType === "standard"
    })

    let standardProfit = premiumPlan.reduce((total, totalAmount) => {
      return total + totalAmount.amount
    }, 0)

    // calculate the percentage for subscription used
    let premiumPercent = (premiumPlan.length / revenue.length) * 100
    let standardPercent = (standardPlan.length / revenue.length) * 100

    const latestOrder = await UserRepository.findAllUsersParams({
      enrollmentStatus: "active",
    })

    return {
      success: true,
      msg: authMessages.ADMIN_FOUND,
      data: {
        totalRevenue,
        totalOrders: revenue.length,
        instructors: instructor.length < 1 ? 0 : instructor.length,
        users: user.length < 1 ? 0 : user.length,
      },
      bestSellers: {
        premium: { sold: premiumPlan.length, profit: premiumProfit },
        standard: { sold: standardPlan.length, profit: standardProfit },
      },
      percentage: {
        standard: standardPercent.toFixed(2),
        premium: premiumPercent.toFixed(2),
      },
      latestOrder,
    }
  }

  static async instructorDashboardAnalysisService(query, locals) {
    const { from, to } = query
    let extra = {}
    if (from && to) {
      let start = new Date(from)
      let end = new Date(to)
      end.setHours(0, 0, 0, 0)
      extra = {
        createdAt: {
          $gte: start,
          $lte: new Date(end.getTime() + 24 * 60 * 60 * 1000),
        },
      }
    }

    const instructor = await AdminRepository.fetchAdmin({
      role: "instructor",
      _id: new mongoose.Types.ObjectId(locals),
    })

    if (!instructor) return { success: false, msg: `Invalid instructor` }
    const instructorStudent = await UserRepository.findAllUsersParams({
      ...extra,
      courseId: new mongoose.Types.ObjectId(instructor.courseId),
    })
    const otherStudent = await UserRepository.findAllUsersParams({
      ...extra,
    })

    return {
      success: true,
      msg: authMessages.ADMIN_FOUND,
      data: {
        myStudent: instructorStudent.length < 1 ? 0 : instructorStudent.length,
        otherStudent: otherStudent.length < 1 ? 0 : otherStudent.length,
        student: instructorStudent,
      },
    }
  }

  static async coursesAndUsers() {
    const courses = await CourseRepository.findCourseWithoutParams({})

    if (courses.length < 1)
      return { success: true, msg: `No course currently available`, data: [] }

    // Initialize an array to hold course enrollment counts
    const courseEnrollmentCounts = []

    for (const course of courses) {
      const enrolledUsersCount = await UserRepository.countUser({
        courseId: new mongoose.Types.ObjectId(course._id),
      })
      // Add the course and its enrollment count to the array

      courseEnrollmentCounts.push({
        _id: course._id,
        overview: course.overview,
        title: course.title,
        userCount: enrolledUsersCount,
      })
    }

    return {
      success: true,
      msg: `Course fetch successfully`,
      data: courseEnrollmentCounts,
    }
  }
}

module.exports = { AdminAuthService }
