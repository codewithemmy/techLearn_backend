const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    overview: { type: String },
    modules: [
      {
        module: { type: String },
        lessonNoteTitle: { type: String },
        lessonNoteContent: { type: String },
        assessment: [{ question: { type: String }, answer: { type: Number } }],
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
