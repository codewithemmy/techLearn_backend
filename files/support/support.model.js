const mongoose = require("mongoose")

const supportSchema = new mongoose.Schema(
  {
    title: { type: String },
    email: { type: String },
    ticketId: { type: String },
    status: {
      type: String,
      default: "new",
      enum: ["new", "on-going", "resolved"],
    },
    message: {
      type: String,
    },
    userType: {
      type: String,
      enum: ["Admin", "User"],
    },
    userId: {
      type: mongoose.Types.ObjectId,
      refPath: "userType",
    },
    response: [
      {
        userType: {
          type: String,
          enum: ["Admin", "User"],
        },
        user: {
          type: mongoose.Schema.ObjectId,
          refPath: "response.userType",
        },
        message: String,
        postedAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  { timestamps: true }
)

const support = mongoose.model("Support", supportSchema, "support")

module.exports = { Support: support }
