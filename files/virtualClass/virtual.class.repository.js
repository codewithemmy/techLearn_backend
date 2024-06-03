const { LIMIT, SKIP, SORT } = require("../../constants")
const { VirtualClass } = require("./virtual.class.model")

class VirtualClassRepository {
  static async create(payload) {
    return VirtualClass.create({ ...payload })
  }

  static async fetchOne(payload) {
    return VirtualClass.findOne({ ...payload })
  }

  static async fetchWithParams(payload) {
    const {
      limit = LIMIT,
      skip = SKIP,
      sort = SORT,
      ...restOfPayload
    } = payload

    return await VirtualClass.find({ ...restOfPayload })
      .sort(sort)
      .skip(skip)
      .limit(limit)
  }

  static async fetch(payload, select) {
    return VirtualClass.find({ ...payload }).select(select)
  }

  static async updateVirtualClassDetails(params, payload) {
    return await VirtualClass.findOneAndUpdate(
      { ...params },
      { ...payload },
      { new: true }
    )
  }

  static async deleteVirtualClass(params, payload) {
    return await VirtualClass.findOneAndDelete({ ...params })
  }
}

module.exports = { VirtualClassRepository }
