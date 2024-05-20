const { queryConstructor, AlphaNumeric } = require("../../utils")
const { SupportFailure, SupportSuccess } = require("./support.messages")
const { SupportRepository } = require("./support.repository")
const mongoose = require("mongoose")

class SupportService {
  static async createSupport(payload, locals) {
    let ticketId = `Ticket# ${AlphaNumeric(4, "number")}-${AlphaNumeric(
      4,
      "alpha"
    )}`

    const confirmTicket = await SupportRepository.fetchOne({ ticketId })

    if (confirmTicket) {
      ticketId = `Ticket# ${AlphaNumeric(4, "number")}-${AlphaNumeric(
        4,
        "alpha"
      )}`
    }
    const support = await SupportRepository.create({
      ...payload,
      ticketId,
      userId: new mongoose.Types.ObjectId(locals._id),
    })

    if (!support) return { success: false, msg: SupportFailure.CREATE }

    return {
      success: true,
      msg: SupportSuccess.CREATE,
    }
  }

  static async fetchSupport(payload, locals) {
    const { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "Support"
    )
    if (error) return { success: false, msg: error }

    let extra = {}
    if (!locals.isAdmin) {
      extra = { userId: new mongoose.Types.ObjectId(locals._id) }
    }

    const support = await SupportRepository.findAllSupportParams({
      ...params,
      limit,
      skip,
      sort,
    })

    if (support.length < 1)
      return { success: true, msg: SupportFailure.FETCH, data: [] }

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

    const support = await SupportRepository.updateSupportDetails(
      { _id: new mongoose.Types.ObjectId(supportId) },
      {
        status: "resolved",
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
