const subscriptionPlansRoute = require("express").Router()
// const { checkSchema } = require("express-validator")
const { isAuthenticated, adminVerifier } = require("../../utils")
const {
  createSubscriptionPlans,
  fetchSubscriptionPlans,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} = require("./subscriptionPlan.controller")
// const { validate } = require("../../validations/validate")
// const {
//   validateSubscriptionPlan,
// } = require("../../validations/subscriptionPlan/subscriptionPlan.validation")

subscriptionPlansRoute.route("/").get(fetchSubscriptionPlans)

subscriptionPlansRoute.use(isAuthenticated)

subscriptionPlansRoute.route("/").post(adminVerifier, createSubscriptionPlans)

subscriptionPlansRoute.put("/update/:id", updateSubscriptionPlan)
subscriptionPlansRoute.delete("/delete/:id", deleteSubscriptionPlan)

module.exports = subscriptionPlansRoute
