const mongoose = require("mongoose")

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscriptionPanId: {
      type: mongoose.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
    },
    transactionId: {
      type: mongoose.Types.ObjectId,
      ref: "Transaction",
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "in-progress", "inactive"],
      default: "in-progress",
    },
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
)

const subscription = mongoose.model(
  "Subscription",
  subscriptionSchema,
  "subscription"
)

module.exports = { Subscription: subscription }
