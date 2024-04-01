const adminRoute = require("../files/admin/admin.routes")
const courseRoute = require("../files/course/course.route")
const subscriptionRoute = require("../files/subscription/subscription.route")
const subscriptionPlansRoute = require("../files/subscription_plan/subscriptionPlan.routes")
const userRoute = require("../files/user/user.route")
const transactionRoute = require("../files/transaction/transaction.route")

const routes = (app) => {
  const base_url = "/api/v1"

  app.use(`${base_url}/admin`, adminRoute)
  app.use(`${base_url}/user`, userRoute)
  app.use(`${base_url}/course`, courseRoute)
  app.use(`${base_url}/subscription-plan`, subscriptionPlansRoute)
  app.use(`${base_url}/subscription`, subscriptionRoute)
  app.use(`${base_url}/transaction`, transactionRoute)
}

module.exports = routes
