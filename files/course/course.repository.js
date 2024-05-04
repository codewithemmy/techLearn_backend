const { Course } = require("./course.model")
const mongoose = require("mongoose")

class CourseRepository {
  static async create(payload) {
    return Course.create(payload)
  }

  static async findCourseWithParams(payload, select) {
    return Course.find({ ...payload }).select(select)
  }
  static async fetchOne(payload, select) {
    return Course.findOne({ ...payload }).select(select)
  }

  static async validateCourse(payload) {
    return Course.exists({ ...payload })
  }

  static async findAllCourseParams(payload) {
    const { limit, skip, sort, ...restOfPayload } = payload

    const course = await Course.find({ ...restOfPayload })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return course
  }

  /// getting single module
  static async findSingleModule(payload) {
    const module = await Course.findById({ ...payload })

    return module
  }

  static async updateCourseDetails(params, payload) {
    const course = await Course.findOneAndUpdate(
      {
        ...params,
      },
      { ...payload },
      { new: true, runValidators: true }
    )

    return course
  }
}

module.exports = { CourseRepository }
