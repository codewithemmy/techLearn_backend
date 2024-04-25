const { BAD_REQUEST, SUCCESS } = require("../../../constants/statusCode")
const { responseHandler } = require("../../../core/response")
const { manageAsyncOps, fileModifier } = require("../../../utils")
const { CustomError } = require("../../../utils/errors")
const { ProfileService } = require("../services/profile.service")

const getUserController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ProfileService.getUserService(req.query, res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const updateUserController = async (req, res, next) => {
  const value = await fileModifier(req)
  const [error, data] = await manageAsyncOps(
    ProfileService.userUpdate(value, res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const changePasswordController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ProfileService.changePassword(req.body, res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const subscriptionPlanController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ProfileService.userSubscriptionPlanService(res.locals.jwt._id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

module.exports = {
  getUserController,
  updateUserController,
  changePasswordController,
  subscriptionPlanController,
}
