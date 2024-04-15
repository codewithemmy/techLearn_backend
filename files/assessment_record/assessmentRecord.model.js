const mongoose = require("mongoose")

const assessmentRecordSchema = new mongoose.Schema(
  {
    moduleId: {
      type: String,
    },
    score: {
      type: Number,
    },
    grade: { string: String, enum: ["failed", "passed"] },
    courseId: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
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
