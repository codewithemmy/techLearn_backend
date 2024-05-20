const { queryConstructor } = require("../../utils")
const { ContactFailure, ContactSuccess } = require("./contact.messages")
const { ContactRepository } = require("./contact.repository")
const mongoose = require("mongoose")

class ContactService {
  static async createContact(payload) {
    const contact = await ContactRepository.create({
      ...payload,
    })

    if (!contact) return { success: false, msg: ContactFailure.CREATE }

    return {
      success: true,
      msg: ContactSuccess.CREATE,
    }
  }

  static async fetchContact(payload) {
    const { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "Contact"
    )
    if (error) return { success: false, msg: error }

    const contact = await ContactRepository.findAllSupportParams({
      ...params,
      limit,
      skip,
      sort,
    })

    if (contact.length < 1)
      return { success: true, msg: ContactFailure.FETCH, data: [] }

    return {
      success: true,
      msg: ContactSuccess.FETCH,
      data: contact,
    }
  }
}

module.exports = { ContactService }
