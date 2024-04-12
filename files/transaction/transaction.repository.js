const { Transaction } = require("./transaction.model")

class TransactionRepository {
  static async create(transactionPayload) {
    return Transaction.create({ ...transactionPayload })
  }

  static async fetchOne(payload) {
    return Transaction.findOne({ ...payload })
  }

  static async fetchTransactionsByParams(userPayload, select) {
    const { limit, skip, sort, ...restOfPayload } = userPayload
    const transaction = await Transaction.find({
      ...restOfPayload,
    })
      .populate("subscriptionPlanId")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select({ metaData: 0, reference: 0 })

    return transaction
  }

  static async fetch(payload, select) {
    return Transaction.find({ ...payload }).select(select)
  }

  static async updateTransactionDetails(transactionPayload, update) {
    return await Transaction.findOneAndUpdate(
      {
        ...transactionPayload,
      },
      { ...update },
      { new: true, runValidators: true }
    )
  }
}

module.exports = { TransactionRepository }
