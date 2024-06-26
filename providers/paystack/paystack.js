const mongoose = require("mongoose")
const { config } = require("../../core/config")
const {
  TransactionMessages,
} = require("../../files/transaction/transaction.messages")
const {
  TransactionRepository,
} = require("../../files/transaction/transaction.repository")

const RequestHandler = require("../../utils/axios.provision")
const { providerMessages } = require("../providers.messages")
const {
  SubscriptionPlanRepository,
} = require("../../files/subscription_plan/subscriptionPlan.repository")
const {
  SubscriptionRepository,
} = require("../../files/subscription/subscription.repository")
const { UserRepository } = require("../../files/user/user.repository")
const {
  NotificationRepository,
} = require("../../files/notification/notification.repository")

const { sendMailNotification } = require("../../utils/email")

//paystack service
class PaystackPaymentService {
  paymentRequestHandler = RequestHandler.setup({
    baseURL: config.PAYSTACK_URL,
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${config.PAYSTACK_KEY}`,
      "Accept-Encoding": "gzip,deflate,compress",
    },
  })

  checkSuccessStatus(status, gatewayResponse) {
    if (status === "success") return { success: true, msg: gatewayResponse }

    return { success: false, msg: gatewayResponse }
  }

  async verifySuccessOfPayment(payload) {
    const statusVerification = this.checkSuccessStatus(
      payload.status,
      payload.gateway_response
    )

    let responseStatus = "pending"
    if (statusVerification.success) {
      responseStatus = "confirmed"
    } else {
      responseStatus = "failed"
    }

    const updatedExisting =
      await TransactionRepository.updateTransactionDetails(
        { reference: payload.reference },
        { status: responseStatus, metaData: JSON.stringify(payload) }
      )

    if (!updatedExisting)
      return { success: false, msg: TransactionMessages.PAYMENT_FAILURE }

    return {
      success: statusVerification.success,
      msg: statusVerification.msg,
    }
  }

  async initiatePayment(paymentPayload) {
    const { email, amount, callbackUrl } = paymentPayload
    const modifiedAmount = `${amount}00`
    const paystackResponse = await this.paymentRequestHandler({
      method: "POST",
      url: "/transaction/initialize",
      data: {
        amount: modifiedAmount,
        email,
        callback_url: "https://user.intellio.academy/login",
      },
    })

    if (!paystackResponse.status)
      return { success: false, msg: providerMessages.INITIATE_PAYMENT_FAILURE }

    const paystackData = paystackResponse.data.data

    const response = {
      authorizationUrl: paystackData.authorization_url,
      accessCode: paystackData.access_code,
      reference: paystackData.reference,
    }

    return {
      success: true,
      msg: providerMessages.INITIATE_PAYMENT_SUCCESS,
      data: response,
    }
  }

  async verifyCardPayment(payload) {
    //check success of transaction
    const { data } = payload
    const transaction = await TransactionRepository.fetchOne({
      reference: data.reference,
    })

    if (!transaction?._id)
      return { success: false, msg: TransactionMessages.TRANSACTION_NOT_FOUND }

    if (transaction?.status != "pending")
      return { success: false, msg: TransactionMessages.DUPLICATE_TRANSACTION }

    const verifyAndUpdateTransactionRecord = await this.verifySuccessOfPayment(
      data
    )

    if (!verifyAndUpdateTransactionRecord.success) {
      return { success: false, msg: verifyAndUpdateTransactionRecord.msg }
    }

    //get and confirm if the subscription plan exist
    const subscriptionPlan = await SubscriptionPlanRepository.fetchOne({
      _id: new mongoose.Types.ObjectId(transaction.subscriptionPlanId),
    })

    //create a check or date when subscription will expire
    const currentDate = new Date()
    let futureDate
    if (subscriptionPlan.duration === "monthly") {
      futureDate = new Date(currentDate.getTime() + 31 * 24 * 60 * 60 * 1000)
    }
    const futureDateISOString = futureDate.toISOString()

    //create a subscription since webhook is successful
    await SubscriptionRepository.create({
      userId: new mongoose.Types.ObjectId(transaction.userId),
      subscriptionPanId: new mongoose.Types.ObjectId(
        transaction.subscriptionPlanId
      ),
      transactionId: new mongoose.Types.ObjectId(subscriptionPlan._id),
      status: "active",
      isConfirmed: true,
      expiresAt: futureDateISOString,
    })

    const { authorization } = data
    // upgrade user plan type
    await UserRepository.updateUserDetails(
      {
        _id: new mongoose.Types.ObjectId(transaction.userId),
      },
      {
        userType: subscriptionPlan.planType,
        "paystackCardDetails.authorization": authorization.authorization_code,
        "paystackCardDetails.bin": authorization.bin,
        "paystackCardDetails.last4": authorization.last4,
        "paystackCardDetails.expMonth": authorization.exp_month,
        "paystackCardDetails.channel": authorization.channel,
        "paystackCardDetails.cardType": authorization.card_type,
        "paystackCardDetails.bank": authorization.bank,
        "paystackCardDetails.accountName": authorization.account_name,
      }
    )
    const expiryDate = futureDate.toLocaleString().slice(0, 10)
    try {
      Promise.all([
        await NotificationRepository.createNotification({
          recipientId: new mongoose.Types.ObjectId(transaction.userId),
          recipient: "User",
          title: "Subscription Plan Successful",
          message: `You have successfully subscribed for plan- ${subscriptionPlan.planType}. Your subscription expires on ${expiryDate} and you can renew your subscription. You can now enroll for a course. Enjoy your learning journey.`,
        }),
        await NotificationRepository.createNotification({
          recipient: "Super-Admin",
          title: "Subscription Plan",
          message: `Hi, A user just subscribed for plan- ${subscriptionPlan.planType}`,
        }),
        await sendMailNotification(
          transaction.userId.email,
          "Subscription Plan Successful",
          {
            expiryDate,
            username: transaction.userId.username,
            planType: subscriptionPlan.planType,
          },
          "COURSE_ENROL"
        ),
      ])
    } catch (error) {
      console.log("notification error", error)
    }
    return { success: true, msg: TransactionMessages.PAYMENT_SUCCESS }
  }

  async verifyProviderPayment(reference) {
    const { data: response } = await this.paymentRequestHandler({
      method: "GET",
      url: `/transaction/verify/${reference}`,
    })

    if (response.status && response.message == "Verification successful") {
      return this.verifyCardPayment(response)
    }

    return { success: false, msg: response.message }
  }
}

module.exports = { PaystackPaymentService }
