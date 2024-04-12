const mongoose = require("mongoose")

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    recipientId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    recipient: {
      type: String,
      enum: ["User", "Admin"],
    },
    title: {
      type: String,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
    },
  },
  { timestamps: true }
)

const notification = mongoose.model(
  "Notification",
  NotificationSchema,
  "notification"
)

module.exports = { Notification: notification }
