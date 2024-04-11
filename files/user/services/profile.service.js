const { default: mongoose } = require("mongoose")
const {
  hashPassword,
  verifyPassword,
  queryConstructor,
} = require("../../../utils")
const { UserSuccess, UserFailure } = require("../user.messages")
const { UserRepository } = require("../user.repository")

class ProfileService {
  static async userUpdate(payload, locals) {
    const { image, body } = payload
    const updateUser = await UserRepository.updateUserDetails(
      { _id: locals._id },
      {
        ...body,
        profileImage: image,
      }
    )

    if (!updateUser) return { success: false, msg: UserFailure.UPDATE }

    return { success: true, msg: UserSuccess.UPDATE }
  }

  static async getUserService(userPayload, locals) {
    const { error, params, limit, skip, sort } = queryConstructor(
      userPayload,
      "createdAt",
      "User"
    )
    if (error) return { success: false, msg: error }

    let extra = {}
    if (!locals.isAdmin) {
      extra = { _id: new mongoose.Types.ObjectId(locals._id) }
    }

    const allUsers = await UserRepository.findAllUsersParams({
      ...params,
      ...extra,
      limit,
      skip,
      sort,
    })

    if (allUsers.length < 1) return { success: false, msg: UserFailure.FETCH }

    return { success: true, msg: UserSuccess.FETCH, data: allUsers }
  }

  static async changePassword(body, locals) {
    const { currentPassword, newPassword } = body

    const user = await UserRepository.findSingleUserWithParams({
      _id: locals._id,
    })

    if (!user) return { success: false, msg: UserFailure.UPDATE }

    const isPassword = await verifyPassword(currentPassword, user.password)

    if (!isPassword) return { success: false, msg: UserFailure.UPDATE }

    user.password = await hashPassword(newPassword)
    const updateUser = await user.save()

    if (!updateUser) return { success: false, msg: UserFailure.UPDATE }

    return { success: true, msg: UserSuccess.UPDATE }
  }
}

module.exports = { ProfileService }
