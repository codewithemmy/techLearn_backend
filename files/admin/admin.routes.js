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
} = require("./admin.controller")

//admin route
adminRoute.route("/login").post(adminLogin)

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

module.exports = adminRoute
