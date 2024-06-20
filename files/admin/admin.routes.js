const adminRoute = require("express").Router()
const { isAuthenticated, adminVerifier } = require("../../utils/index")
const { uploadManager } = require("../../utils/multer")

const {
  adminSignUpController,
  adminLogin,
  updateAdminController,
  getLoggedInAdminController,
  getAdminController,
  dashboardAnalysisController,
  instructorDashboardAnalysisController,
  coursesAndUsersController,
  superAdminUpdateAdminController,
  deleteAdminController,
  subscriberController,
} = require("./admin.controller")

//admin route
adminRoute.route("/login").post(adminLogin)

//subscriber route
adminRoute.route("/subscribe").post(subscriberController)

adminRoute.use(isAuthenticated)
adminRoute.route("/").post(adminVerifier, adminSignUpController)
adminRoute.route("/").get(getAdminController)
adminRoute.route("/me").get(getLoggedInAdminController)

adminRoute
  .route("/")
  .patch(uploadManager("profileImage").single("image"), updateAdminController)

//dashboard analysis
adminRoute.route("/dashboard").get(dashboardAnalysisController)
adminRoute
  .route("/instructor-dashboard")
  .get(instructorDashboardAnalysisController)

//admin role users and courses
adminRoute.route("/course-list").get(coursesAndUsersController)

//super admin updating admin
adminRoute
  .route("/update/:id")
  .patch(
    uploadManager("profileImage").single("image"),
    superAdminUpdateAdminController
  )

//delete admin route
adminRoute.route("/:id").delete(deleteAdminController)

module.exports = adminRoute
