const { uploadManager } = require("../../utils/multer");
const { checkSchema } = require("express-validator");
const {
  createUserValidation,
} = require("../../validations/users/createUser.validation");
const { validate } = require("../../validations/validate");
const userRoute = require("express").Router();
const { isAuthenticated } = require("../../utils");

//controller files
const {
  createUserController,
  userLoginController,
} = require("../user/controllers/user.controller");

//profile
const {
  profileImageController,
} = require("../user/controllers/profile.controller");
const {} = require("../review/review.controller");
const {
  loginUserValidation,
} = require("../../validations/users/loginUser.Validation");
const {} = require("../../validations/review/createReview.validation");

//routes
userRoute
  .route("/")
  .post(validate(checkSchema(createUserValidation)), createUserController);
userRoute
  .route("/login")
  .post(validate(checkSchema(loginUserValidation)), userLoginController);

userRoute.use(isAuthenticated);

//profile route
userRoute
  .route("/image/upload")
  .put(uploadManager("profileImage").single("image"), profileImageController);

module.exports = userRoute;
