const supportRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")
const {
  createSupportController,
  fetchSupportController,
  updateSupportController,
  supportResponseController,
} = require("./support.controller")

supportRoute.use(isAuthenticated)

//routes
supportRoute.route("/").post(createSupportController)
supportRoute.route("/:id").patch(updateSupportController)
supportRoute.route("/").get(fetchSupportController)
supportRoute.route("/response/:id").patch(supportResponseController)

module.exports = supportRoute
