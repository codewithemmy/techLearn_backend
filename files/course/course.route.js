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
  .post(videoManager("courseImage").single("video"), createCourseController)

courseRoute
  .route("/:id")
  .patch(videoManager("courseImage").single("video"), updateCourseController)
  
courseRoute
  .route("/:id")
  .patch(videoManager("courseImage").single("video"), updateCourseController)

//update module route
courseRoute
  .route("/module/:id")
  .patch(
    videoManager("courseImage").single("video"),
    updateCourseModuleController
  )

courseRoute.route("/").get(getCourseController)

module.exports = courseRoute
