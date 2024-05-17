const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps, fileModifier } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const { CourseService } = require("./course.service")

const createCourseController = async (req, res, next) => {
  let value = await fileModifier(req)
  const [error, data] = await manageAsyncOps(
    CourseService.createCourse(value, res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const getCourseController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    CourseService.getCourse(req.query, res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const updateCourseController = async (req, res, next) => {
  let value = await fileModifier(req)
  const [error, data] = await manageAsyncOps(
    CourseService.updateCourse(value, req.params.id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const updateCourseModuleController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    CourseService.updateCourseModule(req, req.params.id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}
const updateModuleController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    CourseService.updateModule(req, req.params.id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const updateAssessmentController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    CourseService.updateModuleAssessment(req.body, req.params.id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const studentEnrollmentController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    CourseService.studentCourseEnrollment(req.params.id, res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const courseStudentController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    CourseService.courseStudent(req.params.id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const userEnrolledCourseController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    CourseService.userEnrolledCourse(res.locals.jwt._id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const moduleAssessmentController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    CourseService.moduleAssessmentTest(req.body, res.locals.jwt._id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const getSingleModuleController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    CourseService.getSingleModule({
      courseId: req.params.courseId,
      moduleId: req.params.moduleId,
    })
  )
  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const virtualClassRequestController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    CourseService.virtualClassRequest(res.locals.jwt._id)
  )
  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const virtualClassLinkController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    CourseService.virtualClassLink(req.body, res.locals.jwt._id)
  )
  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

module.exports = {
  createCourseController,
  getCourseController,
  updateCourseController,
  updateCourseModuleController,
  updateAssessmentController,
  studentEnrollmentController,
  courseStudentController,
  moduleAssessmentController,
  updateModuleController,
  getSingleModuleController,
  userEnrolledCourseController,
  virtualClassRequestController,
  virtualClassLinkController,
}
