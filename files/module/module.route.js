const moduleRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")
const { uploadManager, multerConfig } = require("../../utils/multer")
const {
  createModuleController,
  updateModuleController,
  getModuleController,
  addLessonController,
  addLessonVideoController,
  addFreeModuleCourse,
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

//add free course module
moduleRoute.route("/free").post(uploadMiddleware, addFreeModuleCourse)

module.exports = moduleRoute
