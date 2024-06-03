const courseRoute = require("express").Router()
const { isAuthenticated, adminVerifier } = require("../../utils")
const { uploadManager } = require("../../utils/multer")
const {
  createCourseController,
  getCourseController,
  updateCourseController,
  studentEnrollmentController,
  courseStudentController,
  userEnrolledCourseController,
  getSingleModuleController,
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

//soft delete course
courseRoute.route("/:id").delete(softDeleteCourseController)

module.exports = courseRoute
