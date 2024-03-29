const adminRoute = require("../files/admin/admin.routes")
const courseRoute = require("../files/course/course.route")
const userRoute = require("../files/user/user.route")

const routes = (app) => {
  const base_url = "/api/v1"

  app.use(`${base_url}/admin`, adminRoute)
  app.use(`${base_url}/user`, userRoute)
  app.use(`${base_url}/course`, courseRoute)
}

module.exports = routes
