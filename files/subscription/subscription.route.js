const subscriptionRoute = require("express").Router()
// const { checkSchema } = require("express-validator")
// const { validate } = require("../../validations/validate")
const { videoManager } = require("../../utils/multer")
const { isAuthenticated, adminVerifier } = require("../../utils")
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
