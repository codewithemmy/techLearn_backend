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
  updateModuleController,
  userEnrolledCourseController,
  getSingleModuleController,
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
  .patch(uploadManager("image").single("image"), updateCourseController)

courseRoute
  .route("/module/:id")
  .patch(
    videoManager("courseVideo").single("video"),
    updateCourseModuleController
  )

courseRoute
  .route("/add-module/:id")
  .patch(videoManager("courseVideo").single("video"), updateModuleController)

courseRoute.route("/module/assessment/:id").patch(updateAssessmentController)

courseRoute.route("/module/:courseId/:moduleId").get(getSingleModuleController)

courseRoute.route("/").get(getCourseController)

//student enrollment
courseRoute.route("/enroll/:id").post(studentEnrollmentController)

//course student
courseRoute.route("/student/:id").get(courseStudentController)

//course student
courseRoute.route("/user-course").get(userEnrolledCourseController)

//module assessment or test
courseRoute.route("/module-assessment").post(moduleAssessmentController)

module.exports = courseRoute
