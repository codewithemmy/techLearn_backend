// const { uploadManager } = require("../../utils/multer")
// const { checkSchema } = require("express-validator")
// const { validate } = require("../../validations/validate")
const userRoute = require("express").Router()
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

//routes
userRoute.route("/").post(createUserController)
userRoute.route("/login").post(userLoginController)
userRoute.route("/forgot-password").post(forgotPasswordController)
userRoute.route("/reset-password").post(resetPasswordController)
userRoute.route("/verify").post(verifyUserController)
userRoute.route("/resend-otp").post(resendOtpController)

// userRoute.use(isAuthenticated)

//profile route
// userRoute
//   .route("/image/upload")
//   .put(uploadManager("profileImage").single("image"), profileImageController)

module.exports = userRoute
