// const { uploadManager } = require("../../utils/multer")
// const { checkSchema } = require("express-validator")
// const { validate } = require("../../validations/validate")
const userRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")
const { uploadManager } = require("../../utils/multer")
// const { isAuthenticated } = require("../../utils")

//controller files
const {
  createUserController,
  userLoginController,
  forgotPasswordController,
  resetPasswordController,
  verifyUserController,
  resendOtpController,
} = require("../user/controllers/user.controller")
const {
  updateUserController,
  getUserController,
  changePasswordController,
} = require("./controllers/profile.controller")

//routes
userRoute.route("/").post(createUserController)
userRoute.route("/login").post(userLoginController)
userRoute.route("/forgot-password").post(forgotPasswordController)
userRoute.route("/reset-password").post(resetPasswordController)
userRoute.route("/verify").post(verifyUserController)
userRoute.route("/resend-otp").post(resendOtpController)

userRoute.use(isAuthenticated)

// profile route
userRoute
  .route("/")
  .patch(uploadManager("profileImage").single("image"), updateUserController)

userRoute.route("/").get(getUserController)
userRoute.route("/change-password").patch(changePasswordController)

module.exports = userRoute
