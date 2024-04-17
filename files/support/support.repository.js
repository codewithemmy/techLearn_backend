const { Support } = require("./support.model")

class SupportRepository {
  static async create(payload) {
    return Support.create(payload)
  }

  static async findSupportWithParams(payload, select) {
    return Support.find({ ...payload }).select(select)
  }

  static async fetchOne(payload, select) {
    return Support.findOne({ ...payload }).select(select)
  }

  static async validateSupport(payload) {
    return Support.exists({ ...payload })
  }

  static async findAllSupportParams(payload) {
    const { limit, skip, sort, ...restOfPayload } = payload

    const support = await Support.find({ ...restOfPayload })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return support
  }

  static async updateSupportDetails(params, payload) {
    const support = await Support.findOneAndUpdate(
      {
        ...params,
      },
      { ...payload },
      { new: true, runValidators: true }
    )

    return support
  }
}

module.exports = { SupportRepository }
