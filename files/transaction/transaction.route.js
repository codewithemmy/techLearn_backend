const transactionRoute = require("express").Router()

const { isAuthenticated } = require("../../utils")
const {
  paymentTransactionController,
  paystackWebHook,
  verifyTransactionController,
} = require("./controller/transaction.controller")

transactionRoute.post("/paystack-webhook", paystackWebHook)

transactionRoute.use(isAuthenticated)

transactionRoute.post("/initiate", paymentTransactionController)
transactionRoute.post("/verify", verifyTransactionController)

//routes
module.exports = transactionRoute
