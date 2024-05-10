const googleRoute = require("express").Router()
require("../../utils/passport")
const passport = require("passport")
const {
  googleSuccessController,
  googleFailureController,
} = require("./google.controller")

//routes
googleRoute.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
)

googleRoute.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/google/success",
    failureRedirect: "/auth/google/failure",
  })
)

googleRoute.get("/auth/google/success", googleSuccessController)
googleRoute.get("/auth/google/failure", googleFailureController)

module.exports = googleRoute
