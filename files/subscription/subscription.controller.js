const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps } = require("../../utils/index")
const { CustomError } = require("../../utils/errors")
const { SubscriptionService } = require("./subscription.service")

const createSubscriptionController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    SubscriptionService.createSubscription(req.body)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const fetchSubscriptionController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    SubscriptionService.fetchSubscription(req.query)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const updateSubscriptionController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    SubscriptionService.updateSubscription(req.params.id, req.body)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

module.exports = {
  createSubscriptionController,
  fetchSubscriptionController,
  updateSubscriptionController,
}
