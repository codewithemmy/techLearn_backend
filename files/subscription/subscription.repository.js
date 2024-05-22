const { Subscription } = require("./subscription.model")
const { LIMIT, SKIP, SORT } = require("../../constants")

class SubscriptionRepository {
  static async create(payload) {
    return Subscription.create({ ...payload })
  }

  static async fetchOne(payload) {
    return Subscription.findOne({ ...payload }).populate("subscriptionPanId")
  }

  static async fetchWithParams(payload, select) {
    const {
      limit = LIMIT,
      skip = SKIP,
      sort = SORT,
      ...restOfPayload
    } = payload

    return await Subscription.find({
      ...restOfPayload,
    })
      .populate({
        path: "subscriptionPanId",
      })
      .populate({
        path: "userId",
        select: "fullName email username profileImage",
      })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(select)
  }

  static async updateSubscriptionDetails(params, payload) {
    return Subscription.findByIdAndUpdate(
      { ...params },
      { ...payload },
      { new: true, runValidator: true }
    )
  }
}

module.exports = { SubscriptionRepository }
