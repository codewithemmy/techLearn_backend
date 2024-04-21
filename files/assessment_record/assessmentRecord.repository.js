const { AssessmentRecord } = require("./assessmentRecord.model")
const mongoose = require("mongoose")

class AssessmentRecordRepository {
  static async create(payload) {
    return AssessmentRecord.create(payload)
  }

  static async findAssessmentRecordWithParams(payload, select) {
    return AssessmentRecord.find({ ...payload }).select(select)
  }
  static async fetchOne(payload, select) {
    return AssessmentRecord.findOne({ ...payload }).select(select)
  }

  static async validateAssessmentRecord(payload) {
    return AssessmentRecord.exists({ ...payload })
  }

  static async findAllAssessmentRecordParams(payload) {
    const { limit, skip, sort, ...restOfPayload } = payload

    const assessmentRecord = await AssessmentRecord.find({ ...restOfPayload })
      .populate({ path: "userId", select: "username email" })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return assessmentRecord
  }

  static async updateAssessmentRecordDetails(params, payload) {
    const assessmentRecord = await AssessmentRecord.findOneAndUpdate(
      {
        ...params,
      },
      { ...payload },
      { new: true, runValidators: true }
    )

    return assessmentRecord
  }
}

module.exports = { AssessmentRecordRepository }
