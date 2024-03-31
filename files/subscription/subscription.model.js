const mongoose = require("mongoose")

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscriptionId: {
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
      type: Number,
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
