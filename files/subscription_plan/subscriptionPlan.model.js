const mongoose = require("mongoose")

const subscriptionPlanSchema = new mongoose.Schema({
  planType: {
    type: String,
    enum: ["premium", "standard"],
  },
  amount: {
    type: Number,
  },
  description: {
    type: String,
  },
  duration: {
    type: String,
  },
  benefits: [String],
  isDeleted: {
    type: Boolean,
    default: false,
  },
})

const subscriptionPlan = mongoose.model(
  "SubscriptionPlan",
  subscriptionPlanSchema,
  "subscriptionPlan"
)

module.exports = { SubscriptionPlan: subscriptionPlan }
