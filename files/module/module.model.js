const mongoose = require("mongoose")

const courseModuleSchema = new mongoose.Schema(
  {
    label: {
      type: String,
    },
    title: {
      type: String,
    },
    moduleType: { type: String },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    lessons: [
      {
        title: { type: String },
        note: { type: String },
        video: { type: String },
        videoLink: { type: String },
      },
    ],
    courseId: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },
  },
  { timestamps: true }
)

const courseModule = mongoose.model(
  "CourseModule",
  courseModuleSchema,
  "courseModule"
)

module.exports = { CourseModule: courseModule }
