const mongoose = require("mongoose")

const conversationSchema = new mongoose.Schema(
  {
    instructorId: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
    },
    courseId: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
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
