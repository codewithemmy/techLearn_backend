const { LIMIT, SKIP, SORT } = require("../../constants")
const { SubscriptionPlan } = require("./subscriptionPlan.model")

class SubscriptionPlanRepository {
  static async create(subscriptionPlanPayload) {
    return SubscriptionPlan.create({ ...subscriptionPlanPayload })
  }

  static async fetchOne(payload) {
    return SubscriptionPlan.findOne({ ...payload })
  }

  static async fetchWithParams(payload, select = { isDeleted: 0, __v: 0 }) {
    const {
      limit = LIMIT,
      skip = SKIP,
      sort = SORT,
      ...restOfPayload
    } = payload

    return await SubscriptionPlan.find({ ...restOfPayload })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(select)
  }

  static async fetch(payload, select) {
    return SubscriptionPlan.find({ ...payload }).select(select)
  }

  static async updateSubscriptionPlanDetails(params, payload) {
    return await SubscriptionPlan.findOneAndUpdate(
      { ...params },
      { ...payload },
      { new: true }
    )
  }
}

module.exports = { SubscriptionPlanRepository }
