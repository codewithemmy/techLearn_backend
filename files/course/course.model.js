const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    duration: {
      type: String,
    },
    jobOpening: {
      type: String,
    },
    medianSalary: {
      type: String,
    },
    hour: {
      type: String,
    },
    courseCover: {
      type: String,
    },
    overview: { type: String },
    approved: {
      type: Boolean,
      default: false,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    modules: [
      {
        type: mongoose.Types.ObjectId,
        ref: "CourseModule",
      },
    ],
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
)

const course = mongoose.model("Course", courseSchema, "course")

module.exports = { Course: course }
