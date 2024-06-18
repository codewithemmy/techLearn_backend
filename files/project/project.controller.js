const { responseHandler } = require("../../core/response")
const { manageAsyncOps } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const { ProjectService } = require("./project.service")

const createProject = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(ProjectService.create(req.body))
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, 400, data))
  return responseHandler(res, 200, data)
}

const fetchProject = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ProjectService.fetchProject(req.query)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, 400, data))
  return responseHandler(res, 200, data)
}

const updateProject = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ProjectService.updateProject(req.params.id, req.body)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, 400, data))
  return responseHandler(res, 200, data)
}

module.exports = { createProject, fetchProject, updateProject }
