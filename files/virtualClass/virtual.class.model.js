const mongoose = require("mongoose")

const virtualClassSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Types.ObjectId,
    ref: "Course",
  },
  topic: {
    type: String,
  },
  date: {
    type: Date,
  },
  time: {
    type: String,
  },
  link: {
    type: String,
  },
})

const virtualClass = mongoose.model(
  "VirtualClass",
  virtualClassSchema,
  "virtualClass"
)

module.exports = { VirtualClass: virtualClass }
