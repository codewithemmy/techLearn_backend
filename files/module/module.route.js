const moduleRoute = require("express").Router()
const { isAuthenticated, adminVerifier } = require("../../utils")
const { uploadManager, multerConfig } = require("../../utils/multer")
const {
  createModuleController,
  updateModuleController,
  getModuleController,
  addLessonController,
  addLessonVideoController,
  moduleAssessmentController,
  updateAssessmentController,
} = require("./module.controller")

const uploadMiddleware = multerConfig.single("video")

moduleRoute.use(isAuthenticated)

//routes
moduleRoute
  .route("/")
  .post(uploadManager("image").single("image"), createModuleController)

moduleRoute
  .route("/:id")
  .patch(uploadManager("image").single("image"), updateModuleController)

//get course module
moduleRoute.route("/").get(getModuleController)

//add lesson
moduleRoute.route("/lesson/:id").patch(uploadMiddleware, addLessonController)

//add lesson video
moduleRoute
  .route("/lesson-video/:id")
  .patch(uploadMiddleware, addLessonVideoController)

//module assessment or test
moduleRoute.route("/test").post(moduleAssessmentController)

moduleRoute.route("/assessment/:id").patch(updateAssessmentController)

module.exports = moduleRoute
