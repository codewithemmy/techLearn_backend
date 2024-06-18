const projectRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")

projectRoute.use(isAuthenticated)

const {
  fetchProject,
  createProject,
  updateProject,
} = require("./project.controller")

projectRoute.use(isAuthenticated)

//route
projectRoute.route("/").post(createProject)
projectRoute.route("/").get(fetchProject)
projectRoute.route("/:id").patch(updateProject)

module.exports = projectRoute
