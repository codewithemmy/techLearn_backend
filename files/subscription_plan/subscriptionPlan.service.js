const { default: mongoose } = require("mongoose")
const { FORBIDDEN } = require("../../constants/statusCode")
const { queryConstructor } = require("../../utils")
const { SubscriptionPlanMessages } = require("./subscriptionPlan.messages")
const { SubscriptionPlanRepository } = require("./subscriptionPlan.repository")

class SubscriptionPlanService {
  static async createSubscriptionPlan(payload, locals) {
    if (locals.role !== "super") return { success: false, msg: FORBIDDEN }
    const subscriptionPlan = await SubscriptionPlanRepository.create(payload)

    if (!subscriptionPlan._id)
      return { success: false, msg: SubscriptionPlanMessages.CREATE_ERROR }

    return { success: true, msg: SubscriptionPlanMessages.CREATE_SUCCESS }
  }

  static async fetchSubscriptionPlan(query) {
    const { error, params, limit, skip, sort } = queryConstructor(
      query,
      "createdAt",
      "SubscriptionPlan"
    )

    if (error) return { success: false, msg: error }

    let extra = { isDeleted: false }

    const subscriptionPlans = await SubscriptionPlanRepository.fetchWithParams({
      ...params,
      ...extra,
      limit,
      skip,
      sort,
    })

    if (subscriptionPlans.length < 1)
      return {
        success: true,
        msg: SubscriptionPlanMessages.NONE_FOUND,
        data: [],
      }

    return {
      success: true,
      msg: SubscriptionPlanMessages.FETCH_SUCCESS,
      data: subscriptionPlans,
    }
  }

  static async updateSubscriptionPlan(data) {
    const { body, params } = data
    const subscriptionPlan = await SubscriptionPlanRepository.update(
      {
        _id: new mongoose.Types.ObjectId(params.id),
      },
      { ...body }
    )

    if (!subscriptionPlan)
      return { success: false, msg: SubscriptionPlanMessages.UPDATE_ERROR }

    return {
      success: true,
      msg: SubscriptionPlanMessages.UPDATE_SUCCESS,
    }
  }

  static async deleteSubscriptionPlan(data) {
    const { params } = data
    const subscriptionPlan = await SubscriptionPlanRepository.update(
      { _id: new mongoose.Types.ObjectId(params.id) },
      { isDeleted: true }
    )

    if (!subscriptionPlan)
      return { success: false, msg: SubscriptionPlanMessages.UPDATE_ERROR }

    return {
      success: true,
      msg: SubscriptionPlanMessages.UPDATE,
    }
  }
}

module.exports = { SubscriptionPlanService }
