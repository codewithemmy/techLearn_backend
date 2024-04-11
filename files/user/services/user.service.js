const mongoose = require("mongoose")
const {
  hashPassword,
  tokenHandler,
  verifyPassword,
  sanitizePhoneNumber,
  generateOtp,
  AlphaNumeric,
} = require("../../../utils")

const { UserSuccess, UserFailure } = require("../user.messages")
const { UserRepository } = require("../user.repository")
const { sendMailNotification } = require("../../../utils/email")
const { authMessages } = require("../../admin/messages/auth.messages")
const { AuthSuccess } = require("../../auth/auth.messages")

class UserService {
  static async createUser(payload) {
    const { email, fullName } = payload
    let validateEmail

    // const { phone } = sanitizePhoneNumber(phoneNumber)
    validateEmail = await UserRepository.validateUser({
      email: email,
    })

    let randomOtp = AlphaNumeric(4, "number")

    if (validateEmail) return { success: false, msg: UserFailure.EXIST }

    //hash password
    const user = await UserRepository.create({
      ...payload,
      password: await hashPassword(payload.password),
      emailVerificationOtp: await hashPassword(randomOtp),
    })

    if (!user._id) return { success: false, msg: UserFailure.CREATE }

    try {
      /** once the created send otp mail for verification, if accountType is citybuilder send otp to phone number*/
      const substitutional_parameters = {
        name: fullName,
        email,
        otp: randomOtp,
      }

      await sendMailNotification(
        email,
        "Tech-Learn Registration",
        substitutional_parameters,
        "VERIFICATION"
      )
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
    const { email, username, password } = payload

    const user = await UserRepository.findSingleUserWithParams({
      email,
    })

    if (!user) return { success: false, msg: UserFailure.VALID_USER }

    if (!user.isVerified) return { success: false, msg: UserFailure.VERIFIED }

    const isPassword = await verifyPassword(password, user.password)

    if (!isPassword) return { success: false, msg: UserFailure.PASSWORD }

    let token

    token = await tokenHandler({
      isAdmin: false,
      userType: user.userType,
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
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
    console.log("otp", otp)
    try {
      /**send otp to email or phone number*/
      const substitutional_parameters = {
        resetOtp: otp,
      }

      await sendMailNotification(
        email,
        "TechLearn Reset OTP",
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

    const newOtp = await hashPassword(randomOtp)

    //save otp to compare
    user.emailVerificationOtp = newOtp
    await user.save()

    try {
      /**send otp to email or phone number*/
      const substitutional_parameters = {
        resetOtp: randomOtp,
      }

      await sendMailNotification(
        email,
        "TechLearn Reset OTP",
        substitutional_parameters,
        "EMAIL_OTP"
      )
    } catch (error) {
      console.log("otp error", error)
    }

    return { success: true, msg: AuthSuccess.OTP_SENT }
  }

  static async verifyUserEmail(body) {
    const { email, otp } = body

    const user = await UserRepository.findSingleUserWithParams({
      email,
    })

    if (!user) return { success: false, msg: UserFailure.OTP }

    const verifyOtp = await verifyPassword(otp, user.emailVerificationOtp)

    if (!verifyOtp) return { success: false, msg: `Incorrect Otp` }

    user.emailVerificationOtp = null
    user.isVerified = true
    const saveUser = await user.save()

    if (!saveUser) return { success: false, msg: `Unable to verify user email` }

    return { success: true, msg: `User email verified successfully` }
  }

  /**For google login */
  // static async authLoginService(payload) {
  //   const { email } = payload;

  //   const userProfile = await UserRepository.findSingleUserWithParams({
  //     email: email,
  //   });

  //   if (!userProfile) return { success: false, msg: UserFailure.USER_EXIST };

  //   if (userProfile.isVerified !== true)
  //     return { success: false, msg: UserFailure.VERIFIED };

  //   //confirm if user has been deleted
  //   if (userProfile.isDelete)
  //     return { success: false, msg: UserFailure.SOFT_DELETE };

  //   if (!userProfile) return { success: false, msg: UserFailure.USER_FOUND };

  //   let token;

  //   token = await tokenHandler({
  //     _id: userProfile._id,
  //     firstName: userProfile.firstName,
  //     lastName: userProfile.lastName,
  //     email: userProfile.email,
  //     isAdmin: false,
  //   });

  //   const user = {
  //     _id: userProfile._id,
  //     firstName: userProfile.firstName,
  //     lastName: userProfile.lastName,
  //     email: userProfile.email,
  //     accountType: userProfile.accountType,
  //     status: userProfile.status,
  //     ...token,
  //   };

  //   //return result
  //   return {
  //     success: true,
  //     msg: UserSuccess.FETCH,
  //     data: user,
  //   };
  // }

  // static async authCreateUserService(payload) {
  //   const { firstName, lastName, email, accountType } = payload;

  //   const userExist = await UserRepository.validateUser({
  //     email: payload.email,
  //   });

  //   if (userExist) return { success: false, msg: UserFailure.EXIST };

  //   //hash password
  //   const user = await UserRepository.create({
  //     firstName,
  //     lastName,
  //     email,
  //     accountType,
  //     isVerified: true,
  //   });

  //   if (!user._id) return { success: false, msg: UserFailure.CREATE };

  //   /** once the created send otp mail for verification, if accountType is citybuilder send otp to phone number*/
  //   const substitutional_parameters = {
  //     name: lastName,
  //   };

  //   await sendMailNotification(
  //     email,
  //     "Sign-Up",
  //     substitutional_parameters,
  //     "GOOGLE_SIGNUP"
  //   );

  //   let token;

  //   token = await tokenHandler({
  //     _id: user._id,
  //     firstName: user.firstName,
  //     lastName: user.lastName,
  //     email: user.email,
  //     isAdmin: false,
  //   });

  //   const loginDetails = {
  //     _id: user._id,
  //     firstName: user.firstName,
  //     lastName: user.lastName,
  //     email: user.email,
  //     accountType: user.accountType,
  //     status: user.status,
  //     ...token,
  //   };

  //   //return result
  //   return {
  //     success: true,
  //     msg: UserSuccess.CREATE,
  //     data: loginDetails,
  //   };
  // }
}

module.exports = { UserService }
