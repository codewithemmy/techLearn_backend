const mongoose = require("mongoose")

const courseModuleSchema = new mongoose.Schema(
  {
    label: {
      type: String,
    },
    title: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    lessons: [
      {
        title: { type: String },
        note: { type: String },
        video: { type: String },
      },
    ],
    assessment: [
      {
        question: { type: String },
        options: [{ type: String }],
        answer: { type: Number },
      },
    ],
    courseId: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      required: true,
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
