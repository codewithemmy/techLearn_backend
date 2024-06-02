const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps, fileModifier } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const { ModuleService } = require("./module.service")

const createModuleController = async (req, res, next) => {
  let value = await fileModifier(req)
  const [error, data] = await manageAsyncOps(
    ModuleService.createModule(value, res.locals.jwt)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}

const getModuleController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ModuleService.getModule(req.query, res.locals.jwt)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}

const updateModuleController = async (req, res, next) => {
  let value = await fileModifier(req)
  const [error, data] = await manageAsyncOps(
    ModuleService.updateModule(value, req.params.id)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}

const addLessonController = async (req, res, next) => {
  let value = await fileModifier(req)
  const [error, data] = await manageAsyncOps(
    ModuleService.addModuleLesson(req, req.params.id)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}
const addLessonVideoController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ModuleService.uploadLessonVideo(req, req.params.id)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}

const fetchSingleModuleController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ModuleService.getSingleModule(req.params.id)
  )

  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

const updateAssessmentController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ModuleService.updateModuleAssessment(req.body, req.params.id)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}

const moduleAssessmentController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ModuleService.moduleAssessmentTest(req.body, res.locals.jwt._id)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}

module.exports = {
  createModuleController,
  getModuleController,
  updateModuleController,
  fetchSingleModuleController,
  addLessonController,
  addLessonVideoController,
  updateAssessmentController,
  moduleAssessmentController,
}
