const courseRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")
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
  .post(videoManager("courseVideo").single("video"), createCourseController)

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
