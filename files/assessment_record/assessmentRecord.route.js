const assessmentRoute = require("express").Router()
const { isAuthenticated, adminVerifier } = require("../../utils")
const { uploadManager } = require("../../utils/multer")
const {
  updateAssessmentController,
  createAssessmentController,
  getAssessmentController,
} = require("./assessmentRecord.controller")

assessmentRoute.use(isAuthenticated)

//routes
assessmentRoute
  .route("/")
  .post(
    uploadManager("image").single("image"),
    adminVerifier,
    createAssessmentController
  )

assessmentRoute.route("/:id").patch(updateAssessmentController)

assessmentRoute.route("/").get(getAssessmentController)

module.exports = assessmentRoute
