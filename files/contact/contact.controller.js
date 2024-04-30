const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const { ContactService } = require("./contact.service")

const createContactController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ContactService.createContact(req.body)
  )

  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const fetchContactController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ContactService.fetchContact(req.query)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

module.exports = {
  createContactController,
  fetchContactController,
}
