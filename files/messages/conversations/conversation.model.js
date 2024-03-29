const mongoose = require("mongoose")

const conversationSchema = new mongoose.Schema(
  {
    entityOne: {
      type: String,
      enum: ["User"],
    },
    entityOneId: {
      type: mongoose.Types.ObjectId,
      refPath: "entityOne",
    },
    entityTwo: {
      type: String,
      enum: ["User"],
    },
    entityTwoId: {
      type: mongoose.Types.ObjectId,
      refPath: "entityTwo",
    },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

const conversation = mongoose.model(
  "Conversation",
  conversationSchema,
  "conversation"
)

module.exports = { Conversation: conversation }
