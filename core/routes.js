const adminRoute = require("../files/admin/admin.routes")

const routes = (app) => {
  const base_url = "/api/v1"

  app.use(`${base_url}/admin`, adminRoute)
}

module.exports = routes
