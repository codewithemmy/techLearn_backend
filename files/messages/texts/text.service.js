const { default: mongoose } = require("mongoose")
const {
  ConversationRepository,
} = require("../conversations/conversation.repository")
const { TextRepository } = require("./text.repository")
const { TextMessages } = require("./text.messages")
const { AdminRepository } = require("../../admin/admin.repository")
const { queryConstructor } = require("../../../utils")

class TextService {
  static async sendText(payload, textPayload) {
    const { courseId, message, sentBy } = payload

    if (!courseId) return { success: false, msg: `CourseId not found` }

    const { _id } = textPayload

    let instructor
    let conversationId
    let conversation = await ConversationRepository.findSingleConversation({
      courseId: new mongoose.Types.ObjectId(courseId),
    })

    if (!conversation) {
      instructor = await AdminRepository.fetchAdmin({
        courseId: new mongoose.Types.ObjectId(courseId),
      })

      if (!instructor)
        return { success: false, msg: `Invalid courseId provided` }

      const newConversation = await ConversationRepository.createConversation({
        courseId: new mongoose.Types.ObjectId(courseId),
        instructorId: new mongoose.Types.ObjectId(instructor._id),
      })
      conversationId = newConversation._id
      conversation = newConversation
    } else conversationId = conversation._id

    if (!message) {
      return { success: false, msg: TextMessages.CREATE_ERROR }
    }

    const text = await TextRepository.createText({
      senderId: new mongoose.Types.ObjectId(_id),
      sender: sentBy,
      conversationId,
      message,
      courseId,
    })

    if (!text._id) return { success: false, msg: TextMessages.CREATE_ERROR }

    // updating conversation updatedAt so the conversation becomes the most recent
    await ConversationRepository.updateConversation(
      { _id: new mongoose.Types.ObjectId(conversationId) },
      { updatedAt: new Date() }
    )

    return { success: true, msg: TextMessages.CREATE, data: { courseId } }
  }

  static async fetchTexts(textPayload, user) {
    const { error, params, limit, skip, sort } = queryConstructor(
      textPayload,
      "createdAt",
      "Text"
    )
    if (error) return { success: false, msg: error }

    if (!params.courseId)
      return { success: false, msg: TextMessages.MISSING_CONVERSATION_ID }

    const conversation = await ConversationRepository.findSingleConversation({
      courseId: new mongoose.Types.ObjectId(params.courseId),
    })

    if (!conversation)
      return { success: false, msg: `Invalid course id for chat` }

    const texts = await TextRepository.fetchTextsByParams({
      conversationId: new mongoose.Types.ObjectId(conversation._id),
      limit,
      skip,
      sort,
    })

    if (texts.length === 0)
      return { success: false, msg: TextMessages.FETCH_NONE }

    return { success: true, msg: TextMessages.FETCH, data: texts }
  }
}

module.exports = { TextService }
