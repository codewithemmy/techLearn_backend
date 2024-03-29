const courseRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")
const { uploadManager, videoManager } = require("../../utils/multer")
const {
  createCourseController,
  getCourseController,
  updateCourseController,
  updateCourseModuleController,
} = require("./course.controller")

courseRoute.use(isAuthenticated)

//routes
courseRoute
  .route("/")
  .post(videoManager("courseImage").single("video"), createCourseController)

courseRoute
  .route("/:id")
  .patch(videoManager("courseImage").single("video"), updateCourseController)

courseRoute
  .route("/module/:id")
  .patch(
    videoManager("courseImage").single("video"),
    updateCourseModuleController
  )

module.exports = courseRoute
