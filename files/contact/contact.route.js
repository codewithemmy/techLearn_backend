const contactRoute = require("express").Router()
const { createContactController } = require("./contact.controller")

//routes
contactRoute.route("/").post(createContactController)

module.exports = contactRoute
