const adminRoute = require("express").Router();
const { isAuthenticated } = require("../../utils/index");
const { uploadManager } = require("../../utils/multer");

const {
  adminSignUpController,
  adminLogin,

  updateAdminController,
} = require("./admin.controller");

//admin route
adminRoute.route("/").post(adminSignUpController);
adminRoute.route("/login").post(adminLogin);

adminRoute.use(isAuthenticated);

adminRoute
  .route("/update")
  .patch(uploadManager("profileImage").single("image"), updateAdminController);

module.exports = adminRoute;
