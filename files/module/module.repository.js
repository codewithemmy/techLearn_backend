const { CourseModule } = require("./module.model")
const mongoose = require("mongoose")

class ModuleRepository {
  static async create(payload) {
    return CourseModule.create(payload)
  }

  static async findModuleWithoutParams(payload, select) {
    return CourseModule.find({ ...payload }).select(select)
  }
  static async fetchOne(payload, select) {
    return CourseModule.findOne({ ...payload }).select(select)
  }

  static async validateCourse(payload) {
    return CourseModule.exists({ ...payload })
  }

  static async findAllCourseParams(payload) {
    const { limit, skip, sort, ...restOfPayload } = payload

    const module = await CourseModule.find({ ...restOfPayload })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return module
  }

  /// getting single module
  static async findSingleModule(payload) {
    const module = await CourseModule.findById({ ...payload })

    return module
  }

  static async updateCourseDetails(params, payload) {
    const module = await CourseModule.findOneAndUpdate(
      {
        ...params,
      },
      { ...payload },
      { new: true, runValidators: true }
    )

    return module
  }
}

module.exports = { ModuleRepository }
