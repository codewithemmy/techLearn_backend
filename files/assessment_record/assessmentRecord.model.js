const mongoose = require("mongoose")

const assessmentRecordSchema = new mongoose.Schema(
  {
    moduleId: {
      type: String,
    },
    score: {
      type: Number,
    },
    grade: { type: String },
    courseId: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
)

const assessmentRecord = mongoose.model(
  "AssessmentRecord",
  assessmentRecordSchema,
  "assessmentRecord"
)

module.exports = { AssessmentRecord: assessmentRecord }
