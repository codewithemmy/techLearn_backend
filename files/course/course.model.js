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
    modules: [
      {
        module: { type: String },
        moduleNumber: { type: Number },
        lessonNoteTitle: { type: String },
        lessonNoteContent: { type: String },
        assessmentInstruction: { type: String },
        assessment: [
          {
            question: { type: String },
            options: [{ type: String }],
            answer: { type: Number },
          },
        ],
        video: { type: String },
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
