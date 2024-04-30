const { Contact } = require("./contact.model")

class ContactRepository {
  static async create(payload) {
    return Contact.create(payload)
  }

  static async findContactWithParams(payload, select) {
    return Contact.find({ ...payload }).select(select)
  }

  static async fetchOne(payload, select) {
    return Contact.findOne({ ...payload }).select(select)
  }

  static async validateContact(payload) {
    return Contact.exists({ ...payload })
  }

  static async findAllContactParams(payload) {
    const { limit, skip, sort, ...restOfPayload } = payload

    const contact = await Contact.find({ ...restOfPayload })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return contact
  }
}

module.exports = { ContactRepository }
