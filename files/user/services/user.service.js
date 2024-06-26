const mongoose = require("mongoose")
const {
  hashPassword,
  tokenHandler,
  verifyPassword,
  AlphaNumeric,
} = require("../../../utils")

const { UserSuccess, UserFailure } = require("../user.messages")
const { UserRepository } = require("../user.repository")
const { sendMailNotification } = require("../../../utils/email")
const { AuthSuccess } = require("../../auth/auth.messages")
const {
  NotificationRepository,
} = require("../../notification/notification.repository")
const {
  SubscriptionRepository,
} = require("../../subscription/subscription.repository")

class UserService {
  static async createUser(payload) {
    const { email, fullName, username } = payload
    let validateEmail

    validateEmail = await UserRepository.validateUser({
      $or: [{ email: email }, { username }],
    })

    if (validateEmail) return { success: false, msg: UserFailure.EXIST }
    let randomOtp = AlphaNumeric(4, "number")

    //hash password
    const user = await UserRepository.create({
      ...payload,
      password: await hashPassword(payload.password),
      emailVerificationOtp: randomOtp,
    })

    if (!user._id) return { success: false, msg: UserFailure.CREATE }

    try {
      const substitutional_parameters = {
        name: fullName,
        email,
        otp: randomOtp,
      }

      await sendMailNotification(
        email,
        "Intellio Academy Registration",
        substitutional_parameters,
        "VERIFICATION"
      )

      await NotificationRepository.createNotification({
        recipientId: new mongoose.Types.ObjectId(user._id),
        recipient: "User",
        title: "Welcome",
        message: `You have successfully registered as a user to Intellio E-Learning platform. Enjoy your ride`,
      })
    } catch (error) {
      console.log("error", error)
    }

    const token = await tokenHandler({
      _id: user._id,
    })

    return {
      success: true,
      msg: UserSuccess.CREATE,
      data: token,
    }
  }

  static async userLogin(payload) {
    const { email, password } = payload
    let user
    user = await UserRepository.findSingleUserWithParams({
      email,
    })

    if (!user) return { success: false, msg: UserFailure.VALID_USER }

    if (!user.isVerified) return { success: false, msg: UserFailure.VERIFIED }

    //check subscription validation
    const subscription = await SubscriptionRepository.fetchOne({
      status: "active",
      userId: new mongoose.Types.ObjectId(user._id),
      expired: false,
    })

    if (!subscription) {
      user = await UserRepository.updateUserDetails(
        {
          _id: new mongoose.Types.ObjectId(user._id),
        },
        { userType: "free" }
      )
    }
    // Get current date
    const currentDate = new Date()

    if (subscription && subscription.expiresAt < currentDate) {
      user = await UserRepository.updateUserDetails(
        {
          _id: new mongoose.Types.ObjectId(user._id),
        },
        { userType: "free" }
      )

      subscription.status = "inactive"
      subscription.isConfirmed = false
      subscription.expired = true

      await subscription.save()

      await sendMailNotification(
        email,
        "Subscription Expired",
        {
          username: user.username,
          planType: subscription.subscriptionPanId.planType,
        },
        "EXPIRY"
      )
    }

    const isPassword = await verifyPassword(password, user.password)

    if (!isPassword) return { success: false, msg: UserFailure.PASSWORD }

    let token

    token = await tokenHandler({
      isAdmin: false,
      userType: user.userType,
      _id: user._id,
      userType: user.userType,
      fullName: user.fullName,
      email: user.email,
      courseId: user.courseId,
    })

    //return result
    return {
      success: true,
      msg: `Login Successful`,
      data: {
        userType: user.userType,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        ...token,
      },
    }
  }

  static async forgotPassword(payload) {
    const { email } = payload

    const user = await UserRepository.findSingleUserWithParams({ email })

    if (!user) return { success: false, msg: UserFailure.USER_EXIST }

    let otp = AlphaNumeric(4, "number")

    //save otp to compare
    user.emailVerificationOtp = await hashPassword(otp)
    await user.save()

    try {
      /**send otp to email or phone number*/
      const substitutional_parameters = {
        resetOtp: otp,
      }

      await sendMailNotification(
        email,
        "Reset OTP",
        substitutional_parameters,
        "RESET_OTP"
      )
    } catch (error) {
      console.log("otp error", error)
    }

    return { success: true, msg: AuthSuccess.OTP_SENT }
  }

  static async resetPassword(body) {
    const { newPassword, email } = body

    const user = await UserRepository.findSingleUserWithParams({
      email,
    })

    if (!user) return { success: false, msg: UserFailure.OTP }
    if (user.emailVerificationOtp)
      return { success: false, msg: `otp not verified` }

    user.password = await hashPassword(newPassword)

    const saveUser = await user.save()

    if (!saveUser) return { success: false, msg: UserFailure.PASSWORD_RESET }

    return { success: true, msg: UserSuccess.PASSWORD_RESET }
  }

  static async resendOtp(payload) {
    const { email } = payload

    const user = await UserRepository.findSingleUserWithParams({ email })

    if (!user) return { success: false, msg: UserFailure.USER_EXIST }

    let randomOtp = AlphaNumeric(4, "number")

    //save otp to compare
    user.emailVerificationOtp = randomOtp
    await user.save()

    try {
      const substitutional_parameters = {
        name: user.firstName,
        email,
        otp: randomOtp,
      }

      await sendMailNotification(
        email,
        "Intellio: OTP",
        substitutional_parameters,
        "VERIFICATION"
      )
    } catch (error) {
      console.log("error", error)
    }

    return { success: true, msg: AuthSuccess.OTP_SENT }
  }

  static async verifyUserEmail(body) {
    const { email, otp } = body

    const user = await UserRepository.findSingleUserWithParams({
      email,
    })

    if (!user) return { success: false, msg: UserFailure.OTP }

    if (otp !== user.emailVerificationOtp)
      return { success: false, msg: `Incorrect Otp` }

    user.emailVerificationOtp = null
    user.isVerified = true
    const saveUser = await user.save()

    if (!saveUser) return { success: false, msg: `Unable to verify user email` }

    return { success: true, msg: `User email verified successfully` }
  }
}

module.exports = { UserService }
