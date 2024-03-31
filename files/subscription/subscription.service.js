const { default: mongoose } = require("mongoose")
const { SubscriptionRepository } = require("./subscription.repository")
const { queryConstructor } = require("../../utils")
const { SubscriptionMessages } = require("./subscription.message")

class SubscriptionService {
  static async createSubscription(payload) {
    const subscription = await SubscriptionRepository.create({ ...payload })

    if (!subscription._id)
      return { success: false, msg: SubscriptionMessages.CREATE_ERROR }

    return { success: true, msg: SubscriptionMessages.CREATE_SUCCESS }
  }

  static async fetchSubscription(payload) {
    const { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "Subscription"
    )

    if (error) return { success: false, msg: error }

    const subscription = await SubscriptionRepository.fetchWithParams({
      ...params,
      limit,
      skip,
      sort,
    })

    if (subscription.length < 1)
      return { success: true, msg: SubscriptionMessages.NONE_FOUND, data: [] }

    return {
      success: true,
      msg: SubscriptionMessages.FETCH_SUCCESS,
      data: subscription,
    }
  }

  static async updateSubscription(id, payload) {
    const order = await SubscriptionRepository.fetchOne({
      _id: new mongoose.Types.ObjectId(id),
    })

    if (!order._id)
      return { success: false, msg: SubscriptionMessages.ORDER_ERROR }

    await SubscriptionRepository.updateSubscriptionDetails(
      { _id: new mongoose.Types.ObjectId(id) },
      { payload }
    )

    return {
      success: true,
      msg: SubscriptionMessages.UPDATE_SUCCESS,
    }
  }
}

module.exports = { SubscriptionService }
