const mongoose = require("mongoose")

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    subscriptionPlanId: {
      type: mongoose.Types.ObjectId,
      ref: "SubscriptionPlanId",
    },
    amount: {
      type: Number,
      required: true,
    },
    channel: {
      type: String,
      enum: ["paystack", "bank"],
      default: "paystack",
    },
    bankName: { type: String },
    reference: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "failed"],
      default: "pending",
    },
    paymentFor: {
      type: String,
      enum: ["standard", "premium"],
    },
    metaData: String,
  },
  { timestamps: true }
)

const transaction = mongoose.model(
  "Transaction",
  TransactionSchema,
  "transaction"
)

module.exports = { Transaction: transaction }
