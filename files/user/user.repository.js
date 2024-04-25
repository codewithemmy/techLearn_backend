const { User } = require("./user.model")
const mongoose = require("mongoose")

class UserRepository {
  static async create(payload) {
    return await User.create(payload)
  }

  static async findUserWithParams(userPayload, select) {
    return await User.find({ ...userPayload }).select(select)
  }

  static async findSingleUserWithParams(userPayload) {
    const user = await User.findOne({ ...userPayload })

    return user
  }

  static async validateUser(userPayload) {
    return User.exists({ ...userPayload })
  }

  static async findAllUsersParams(userPayload) {
    const { limit, skip, sort, ...restOfPayload } = userPayload

    const user = await User.find(
      { ...restOfPayload },
      { password: 0, paystackCardDetails: 0 }
    )
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return user
  }

  static async updateUserDetails(id, params) {
    return User.findOneAndUpdate(
      { ...id },
      { ...params },
      { new: true, runValidators: true }
    )
  }
}

module.exports = { UserRepository }
