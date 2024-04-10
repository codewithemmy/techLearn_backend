const textRoute = require("express").Router()
const { isAuthenticated } = require("../../../utils")

const {
  sendTextController,
  fetchTextsController,
} = require("./text.controller")
// const {
//   textValidation,
// } = require("../../../validation/text/sendText.validation")

textRoute.use(isAuthenticated)

//routes
textRoute.route("/").post(sendTextController).get(fetchTextsController)

module.exports = textRoute
