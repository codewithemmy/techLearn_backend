const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    modules: [
      {
        module: { type: String },
        overview: { type: String },
        video: { type: String },
        lessonNote: { type: String },
        assessment: [
          { question: { type: String }, answer: [{ type: Number }] },
        ],
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
