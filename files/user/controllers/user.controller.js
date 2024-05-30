const { BAD_REQUEST, SUCCESS } = require("../../../constants/statusCode")
const { responseHandler } = require("../../../core/response")
const { manageAsyncOps } = require("../../../utils")
const { CustomError } = require("../../../utils/errors")
const { UserService } = require("../../user/services/user.service")

const createUserController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(UserService.createUser(req.body))

  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const userLoginController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(UserService.userLogin(req.body))

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const forgotPasswordController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    UserService.forgotPassword(req.body)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const resetPasswordController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    UserService.resetPassword(req.body)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const resendOtpController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(UserService.resendOtp(req.body))

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const verifyUserController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    UserService.verifyUserEmail(req.body)
  )
  console.log("error", error)
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

module.exports = {
  createUserController,
  userLoginController,
  forgotPasswordController,
  resetPasswordController,
  resendOtpController,
  resendOtpController,
  verifyUserController,
}
