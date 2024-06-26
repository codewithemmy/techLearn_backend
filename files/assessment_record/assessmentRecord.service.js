const { queryConstructor } = require("../../utils")
const {
  AssessmentRecordFailure,
  AssessmentRecordSuccess,
} = require("./assessmentRecord.messages")
const { AssessmentRecordRepository } = require("./assessmentRecord.repository")
const mongoose = require("mongoose")

class AssessmentRecordService {
  static async createAssessment(payload, locals) {
    const assessment = await AssessmentRecordRepository.create({
      ...payload,
    })

    if (!assessment)
      return { success: false, msg: AssessmentRecordFailure.CREATE }

    return {
      success: true,
      msg: AssessmentRecordSuccess.CREATE,
    }
  }

  static async getAssessment(payload, locals) {
    const { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "AssessmentRecord"
    )
    if (error) return { success: false, msg: error }

    let extra = { userId: new mongoose.Types.ObjectId(locals) }

    const assessment =
      await AssessmentRecordRepository.findAllAssessmentRecordParams({
        ...params,
        ...extra,
        limit,
        skip,
        sort,
      })

    if (assessment.length < 1)
      return { success: true, msg: AssessmentRecordFailure.FETCH, data: [] }

    return {
      success: true,
      msg: AssessmentRecordSuccess.FETCH,
      data: assessment,
    }
  }

  static async updateAssessment(payload, locals) {
    const assessment =
      await AssessmentRecordRepository.updateAssessmentRecordDetails(
        { _id: new mongoose.Types.ObjectId(locals) },
        { ...payload }
      )

    if (!assessment)
      return { success: false, msg: AssessmentRecordFailure.UPDATE }

    return { success: true, msg: AssessmentRecordSuccess.UPDATE, data: course }
  }
}

module.exports = { AssessmentRecordService }
