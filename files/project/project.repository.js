const { Project } = require("./project.model")

class ProjectRepository {
  static async create(payload) {
    return await Project.create(payload)
  }

  static async findSingleProjectByParams(payload) {
    return await Project.findOne({ ...payload })
  }
  static async findProjectWithoutQuery(payload) {
    return await Project.find({ ...payload })
  }

  static async fetchProjectByParams(userPayload) {
    let { limit, skip, sort, ...restOfPayload } = userPayload

    const project = await Project.find({
      ...restOfPayload,
    })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return project
  }

  static async updateProjectDetails(payload) {
    return await Project.findOneAndUpdate({ ...payload })
  }

  static async updateProjectDetails(params, payload) {
    const project = await Project.findOneAndUpdate(
      {
        ...params,
      },
      { ...payload },
      { new: true, runValidators: true }
    )

    return project
  }
}

module.exports = { ProjectRepository }
