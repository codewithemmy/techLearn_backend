require("../../utils/passport")
const { SUCCESS, BAD_REQUEST } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const FacebookAuthService = require("./facebook.service")

const facebookSuccessController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    FacebookAuthService.facebookSuccessService(req.user)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const facebookFailureController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    FacebookAuthService.facebookFailureService()
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

module.exports = {
  facebookSuccessController,
  facebookFailureController,
}
