const { SUCCESS, BAD_REQUEST } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const { VirtualClassService } = require("./virtual.class.service")

const createVirtualClassController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    VirtualClassService.create(req.body, res.locals.jwt)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}

const fetchVirtualClassController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    VirtualClassService.fetch(req.query, res.locals.jwt)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}

const updateVirtualClassController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    VirtualClassService.update(req.body, req.params.id)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, 200, data)
}

const deleteVirtualClassController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    VirtualClassService.delete(req.params.id)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, 200, data)
}

module.exports = {
  createVirtualClassController,
  fetchVirtualClassController,
  updateVirtualClassController,
  deleteVirtualClassController,
}
