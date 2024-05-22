const mongoose = require("mongoose")
require("../../utils/passport")
const { tokenHandler } = require("../../utils")
const { UserRepository } = require("../user/user.repository")

class FacebookAuthService {
  static async facebookSuccessService(payload) {
    const { email, _json } = payload

    const userExist = await UserRepository.validateUser({
      email,
    })

    const { given_name, family_name } = _json

    if (!userExist) {
      const user = await UserRepository.create({
        email,
        firstName: family_name,
        lastName: given_name,
        username: `${family_name} ${given_name}`,
        loginType: "auth-login",
        isVerified: true,
      })

      if (!user._id) return { success: false, msg: `unable to authenticate` }

      let token = await tokenHandler({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountType: user.accountType,
      })

      const result = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountType: user.accountType,
        ...token,
      }

      return {
        success: true,
        msg: `successful`,
        data: result,
      }
    } else {
      const user = await UserRepository.findSingleUserWithParams({ email })

      let token = await tokenHandler({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountType: user.accountType,
      })

      const result = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountType: user.accountType,
        ...token,
      }

      return {
        success: true,
        msg: `successful`,
        data: result,
      }
    }
  }

  static async facebookFailureService() {
    return {
      success: true,
      msg: `Something Went Wrong trying to get Authenticated`,
    }
  }
}

module.exports = FacebookAuthService
