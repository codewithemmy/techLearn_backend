const courseRoute = require("express").Router()
const { isAuthenticated, adminVerifier } = require("../../utils")
const { uploadManager } = require("../../utils/multer")
const {
  createCourseController,
  getCourseController,
  updateCourseController,
  updateAssessmentController,
  studentEnrollmentController,
  courseStudentController,
  moduleAssessmentController,
  userEnrolledCourseController,
  getSingleModuleController,
  virtualClassRequestController,
  virtualClassLinkController,
  softDeleteCourseController,
  fetchOnlyCourseModulesController,
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

courseRoute.route("/module/assessment/:id").patch(updateAssessmentController)

courseRoute.route("/module/:courseId/:moduleId").get(getSingleModuleController)

//get course
courseRoute.route("/").get(getCourseController)

//get only modules
courseRoute.route("/course-modules/:id").get(fetchOnlyCourseModulesController)

//student enrollment
courseRoute.route("/enroll/:id").post(studentEnrollmentController)

//course student
courseRoute.route("/student/:id").get(courseStudentController)

//course student
courseRoute.route("/user-course").get(userEnrolledCourseController)

//module assessment or test
courseRoute.route("/module-assessment").post(moduleAssessmentController)

//virtual class request
courseRoute.route("/virtual-class-request").get(virtualClassRequestController)

//virtual class link
courseRoute.route("/virtual-class-link").post(virtualClassLinkController)

//soft delete course
courseRoute.route("/:id").delete(softDeleteCourseController)

module.exports = courseRoute
