const facebookRoute = require("express").Router()
require("../../utils/passport.facebook")
const passport = require("passport")

const {
  facebookSuccessController,
  facebookFailureController,
} = require("./facebook.controller")

//routes
facebookRoute.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: "email" })
)

facebookRoute.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/auth/facebook/success",
    failureRedirect: "/auth/facebook/failure",
  })
)

facebookRoute.get("/auth/facebook/success", facebookSuccessController)
facebookRoute.get("/auth/facebook/failure", facebookFailureController)

module.exports = facebookRoute
