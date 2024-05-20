const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps, fileModifier } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const { SupportService } = require("./support.service")

const createSupportController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    SupportService.createSupport(req.body, res.locals.jwt)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const fetchSupportController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    SupportService.fetchSupport(req.query, res.locals.jwt)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const updateSupportController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    SupportService.updateSupport(req.body, req.params.id)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const supportResponseController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    SupportService.supportResponse(
      { ...req.body, _id: res.locals.jwt._id },
      req.params.id
    )
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

module.exports = {
  createSupportController,
  fetchSupportController,
  updateSupportController,
  supportResponseController,
}
