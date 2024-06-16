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

//this is for free course, controller
const getFreeCourseController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    CourseService.getCourse({ ...req.query, free: true }, res.locals.jwt)
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

const softDeleteCourseController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    CourseService.softDeleteCourse(req.params.id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const fetchOnlyCourseModulesController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    CourseService.fetchOnlyCourseModules(req.params.id)
  )

  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

const updateCourseAssessmentController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    CourseService.updateCourseAssessment(req.body, req.params.id)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}

const courseAssessmentController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    CourseService.courseAssessmentTest(req.body, res.locals.jwt._id)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}
module.exports = {
  createCourseController,
  getCourseController,
  updateCourseController,
  studentEnrollmentController,
  courseStudentController,
  getSingleModuleController,
  userEnrolledCourseController,
  softDeleteCourseController,
  fetchOnlyCourseModulesController,
  getFreeCourseController,
  updateCourseAssessmentController,
  courseAssessmentController,
}
