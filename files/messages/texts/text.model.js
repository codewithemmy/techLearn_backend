const mongoose = require("mongoose")

const textSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ["User", "Admin"],
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      refPath: "sender",
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    message: {
      type: String,
      trim: true,
    },
    image: String,
  },
  { timestamps: true }
)

const text = mongoose.model("Text", textSchema, "text")

module.exports = { Text: text }
