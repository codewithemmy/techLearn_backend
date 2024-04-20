const { queryConstructor } = require("../../utils")
const { SupportFailure, SupportSuccess } = require("./support.messages")
const { SupportRepository } = require("./support.repository")
const mongoose = require("mongoose")

class SupportService {
  static async createSupport(payload, locals) {
    const support = await SupportRepository.create({
      ...payload,
      userId: new mongoose.Types.ObjectId(locals._id),
    })

    if (!support) return { success: false, msg: SupportFailure.CREATE }

    return {
      success: true,
      msg: SupportSuccess.CREATE,
    }
  }

  static async fetchSupport(payload) {
    const { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "Support"
    )
    if (error) return { success: false, msg: error }

    const support = await SupportRepository.findAllSupportParams({
      ...params,
      limit,
      skip,
      sort,
    })

    if (!support) return { success: true, msg: SupportFailure.FETCH, data: [] }

    return {
      success: true,
      msg: SupportSuccess.FETCH,
      data: support,
    }
  }

  static async updateSupport(payload, supportId) {
    const support = await SupportRepository.updateSupportDetails(
      { _id: new mongoose.Types.ObjectId(supportId) },
      { ...payload }
    )

    if (!support) return { success: false, msg: SupportFailure.UPDATE }

    return { success: true, msg: SupportSuccess.UPDATE }
  }

  static async supportResponse(payload, supportId) {
    const { message, userType, _id } = payload
    const confirmSupport = await SupportRepository.fetchOne({
      _id: new mongoose.Types.ObjectId(supportId),
    })

    if (!confirmSupport) return { success: false, msg: SupportFailure.FETCH }

    if (confirmSupport.status === "resolved")
      return { success: false, msg: SupportFailure.RESOLVED }

    const support = await SupportRepository.updateSupportDetails(
      { _id: new mongoose.Types.ObjectId(supportId) },
      {
        $push: {
          response: {
            $each: [
              {
                user: new mongoose.Types.ObjectId(_id),
                message,
                userType,
              },
            ],
            $position: 0,
          },
        },
      }
    )

    if (!support) return { success: false, msg: SupportFailure.UPDATE }

    return { success: true, msg: SupportSuccess.UPDATE }
  }
}

module.exports = { SupportService }
