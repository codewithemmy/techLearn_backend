const { default: mongoose } = require("mongoose")
const { queryConstructor } = require("../../utils")
const { virtualClassMessages } = require("./virtual.class.messages")
const { VirtualClassRepository } = require("./virtual.class.repository")
const { AdminRepository } = require("../admin/admin.repository")

class VirtualClassService {
  static async create(payload, locals) {
    if (locals.role !== "instructor")
      return {
        success: false,
        msg: `Only instructor can create a virtual class`,
      }
    //confirm instructor class
    const instructor = await AdminRepository.fetchAdmin({
      _id: new mongoose.Types.ObjectId(locals._id),
      role: "instructor",
    })

    if (!instructor) return { success: false, msg: `Instructor not recognized` }

    if (!instructor.courseId)
      return { success: false, msg: `Unable to recognize instructor's course` }

    if (!payload.link) return { success: false, msg: `Link cannot be empty` }

    const virtualClass = await VirtualClassRepository.create({
      ...payload,
      courseId: new mongoose.Types.ObjectId(instructor.courseId),
    })

    if (!virtualClass._id)
      return { success: false, msg: virtualClassMessages.CREATE_ERROR }

    return { success: true, msg: virtualClassMessages.CREATE_SUCCESS }
  }

  static async fetch(query, locals) {
    const { error, params, limit, skip, sort } = queryConstructor(
      query,
      "createdAt",
      "VirtualClass"
    )

    if (error) return { success: false, msg: error }
    let extra = {}
    if (locals.isAdmin) {
      if (locals.role !== "instructor")
        return {
          success: false,
          msg: `You are not eligible to check virtual class details`,
        }

      extra = { courseId: new mongoose.Types.ObjectId(locals.courseId) }
    }
    if (!locals.isAdmin) {
      if (locals.userType !== "premium")
        return {
          success: false,
          msg: `You are not eligible to check virtual class details`,
        }
      extra = { courseId: new mongoose.Types.ObjectId(locals.courseId) }
    }

    const virtualClass = await VirtualClassRepository.fetchWithParams({
      ...params,
      ...extra,
      limit,
      skip,
      sort,
    })

    if (virtualClass.length < 1)
      return {
        success: true,
        msg: virtualClassMessages.NONE_FOUND,
        data: [],
      }

    return {
      success: true,
      msg: virtualClassMessages.FETCH_SUCCESS,
      data: virtualClass,
    }
  }

  static async update(payload, params) {
    const virtualClass = await VirtualClassRepository.updateVirtualClassDetails(
      {
        _id: new mongoose.Types.ObjectId(params),
      },
      { ...payload }
    )

    if (!virtualClass)
      return { success: false, msg: virtualClassMessages.UPDATE_ERROR }

    return {
      success: true,
      msg: virtualClassMessages.UPDATE_SUCCESS,
    }
  }

  static async delete(params) {
    const virtualClass = await VirtualClassRepository.deleteVirtualClass({
      _id: new mongoose.Types.ObjectId(params),
    })

    if (!virtualClass)
      return { success: false, msg: `Unable to delete virtual class` }

    return {
      success: true,
      msg: `Virtual class deleted`,
    }
  }
}

module.exports = { VirtualClassService }
