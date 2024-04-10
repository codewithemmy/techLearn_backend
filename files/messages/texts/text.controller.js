const { BAD_REQUEST, SUCCESS } = require("../../../constants/statusCode")
const { responseHandler } = require("../../../core/response")
const { manageAsyncOps, fileModifier } = require("../../../utils")
const { CustomError } = require("../../../utils/errors")
const { TextService } = require("./text.service")

const sendTextController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    TextService.sendText(req.body, res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const fetchTextsController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    TextService.fetchTexts(req.query, res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

module.exports = {
  sendTextController,
  fetchTextsController,
}
