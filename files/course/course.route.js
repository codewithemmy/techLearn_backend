const courseRoute = require("express").Router()
const { isAuthenticated, adminVerifier } = require("../../utils")
const { videoManager } = require("../../utils/multer")
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
  .post(
    videoManager("courseVideo").single("video"),
    adminVerifier,
    createCourseController
  )

courseRoute
  .route("/:id")
  .patch(videoManager("courseVideo").single("video"), updateCourseController)

courseRoute
  .route("/module/:id")
  .patch(
    videoManager("courseVideo").single("video"),
    updateCourseModuleController
  )

courseRoute.route("/").get(getCourseController)

module.exports = courseRoute
