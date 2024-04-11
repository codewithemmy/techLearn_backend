const adminRoute = require("express").Router()
const { isAuthenticated, adminVerifier } = require("../../utils/index")
const { uploadManager } = require("../../utils/multer")

const {
  adminSignUpController,
  adminLogin,

  updateAdminController,
  getLoggedInAdminController,
  getAdminController,
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

module.exports = adminRoute
