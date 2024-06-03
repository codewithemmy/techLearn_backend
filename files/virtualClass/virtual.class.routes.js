const virtualClassRoute = require("express").Router()
const { isAuthenticated, instructorVerifier } = require("../../utils")

const {
  createVirtualClassController,
  fetchVirtualClassController,
  updateVirtualClassController,
  deleteVirtualClassController,
} = require("./virtual.class.controller")

virtualClassRoute.use(isAuthenticated)
virtualClassRoute
  .route("/")
  .post(instructorVerifier, createVirtualClassController)
virtualClassRoute.route("/").get(fetchVirtualClassController)
virtualClassRoute.patch(
  "/:id",
  instructorVerifier,
  updateVirtualClassController
)
virtualClassRoute.delete("/delete/:id", deleteVirtualClassController)

module.exports = virtualClassRoute
  