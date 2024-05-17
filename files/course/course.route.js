const courseRoute = require("express").Router()
const { isAuthenticated, adminVerifier } = require("../../utils")
const { uploadManager, multerConfig } = require("../../utils/multer")
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
  virtualClassRequestController,
  virtualClassLinkController,
} = require("./course.controller")

const uploadMiddleware = multerConfig.single("video")

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
  .patch(uploadMiddleware, updateCourseModuleController)

courseRoute
  .route("/add-module/:id")
  .patch(uploadMiddleware, updateModuleController)

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

//virtual class request
courseRoute.route("/virtual-class-request").get(virtualClassRequestController)

//virtual class link
courseRoute.route("/virtual-class-link").post(virtualClassLinkController)

module.exports = courseRoute
