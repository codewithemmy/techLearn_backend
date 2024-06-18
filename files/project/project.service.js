const mongoose = require("mongoose")
const { ProjectRepository } = require("./project.repository")
const { queryConstructor } = require("../../utils/index")
const { projectMessages } = require("./project.messages")

class ProjectService {
  static async create(payload) {
    const { courseId, title } = payload

    if (!courseId)
      return { success: false, msg: `CourseId for project cannot be empty` }

    //check title
    const confirmTitle = await ProjectRepository.findSingleProjectByParams({
      title,
      courseId: new mongoose.Types.ObjectId(courseId),
    })

    if (confirmTitle)
      return {
        success: true,
        msg: `project with title already exist for this course`,
      }

    const project = await ProjectRepository.create({
      ...payload,
      courseId: new mongoose.Types.ObjectId(courseId),
    })

    if (!project) return { success: false, msg: `Unable to create project` }

    return { success: true, msg: projectMessages.PROJECT_CREATED }
  }

  static async fetchProject(query) {
    const { error, params, limit, skip, sort } = queryConstructor(
      query,
      "createdAt",
      "Project"
    )

    if (error) return { success: false, msg: error }

    const projects = await ProjectRepository.fetchProjectByParams({
      ...params,
      limit,
      skip,
      sort,
    })

    if (projects.length < 1)
      return {
        success: true,
        msg: projectMessages.PROJECT_NOT_FOUND,
        data: [],
      }

    return {
      success: true,
      msg: projectMessages.PROJECT_FETCHED,
      data: projects,
    }
  }

  static async updateProject(projectId, payload) {
    const support = await ProjectRepository.updateProjectDetails(
      { _id: new mongoose.Types.ObjectId(projectId) },
      { ...payload }
    )

    if (!support) return { success: false, msg: `Unable to update project` }

    return { success: true, msg: `Project update successful` }
  }
}

module.exports = { ProjectService }
