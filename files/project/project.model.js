const mongoose = require("mongoose")

const ProjectSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    instruction: {
      type: String,
    },
  },
  { timestamps: true }
)

const project = mongoose.model("project", ProjectSchema, "project")

module.exports = { Project: project }
