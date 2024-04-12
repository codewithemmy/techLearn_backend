const courseRoute = require("express").Router()
const { isAuthenticated, adminVerifier } = require("../../utils")
const { videoManager, uploadManager } = require("../../utils/multer")
const {
  createCourseController,
  getCourseController,
  updateCourseController,
  updateCourseModuleController,
  updateAssessmentController,
  studentEnrollmentController,
  courseStudentController,
  moduleAssessmentController,
} = require("./course.controller")

courseRoute.use(isAuthenticated)

//routes
courseRoute
  .route("/")
  .post(
    uploadManager("image").single("image"),
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

courseRoute.route("/module/assessment/:id").patch(updateAssessmentController)

courseRoute.route("/").get(getCourseController)

//student enrollment
courseRoute.route("/enroll/:id").post(studentEnrollmentController)

//course student
courseRoute.route("/student/:id").get(courseStudentController)

//module assessment or test
courseRoute.route("/module-assessment").post(moduleAssessmentController)

module.exports = courseRoute
