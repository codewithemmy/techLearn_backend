const assessmentRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")
const {
  updateAssessmentController,
  createAssessmentController,
  getAssessmentController,
} = require("./assessmentRecord.controller")

assessmentRoute.use(isAuthenticated)

assessmentRoute.route("/").post(createAssessmentController)

assessmentRoute.route("/:id").patch(updateAssessmentController)

assessmentRoute.route("/").get(getAssessmentController)

module.exports = assessmentRoute
