const subscriptionRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")
const {
  createSubscriptionController,
  fetchSubscriptionController,
  updateSubscriptionController,
} = require("./subscription.controller")

//authenticated routes go below here
subscriptionRoute.use(isAuthenticated)

subscriptionRoute
  .route("/")
  .post(createSubscriptionController)
  .get(fetchSubscriptionController)
  .patch(updateSubscriptionController)

//routes
module.exports = subscriptionRoute
