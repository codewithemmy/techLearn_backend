const courseRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")
const { uploadManager } = require("../../utils/multer")
const {
  createCourseController,
  getCourseController,
} = require("./course.controller")

courseRoute.use(isAuthenticated)

//routes
courseRoute
  .route("/")
  .post(uploadManager("courseImage").single("image"), createCourseController)
  .get(getCourseController)

module.exports = courseRoute
