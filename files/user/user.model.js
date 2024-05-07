const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    username: {
      type: String,
    },
    password: { type: String },
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide email"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide valid email",
      },
    },
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    introduction: {
      type: String,
    },
    dateOfBirth: {
      type: String,
    },
    postCode: { type: String },
    profileImage: { type: String },
    userType: {
      type: String,
      enum: ["free", "standard", "premium"],
      default: "free",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationOtp: {
      type: String,
    },
    emailVerificationOtp: {
      type: String,
    },
    level: {
      type: String,
    },
    enrollmentStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    courseId: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },
    paystackCardDetails: {
      authorization: String,
      bin: String,
      last4: String,
      expMonth: String,
      expYear: String,
      channel: String,
      cardType: String,
      bank: String,
      accountName: String,
    },
  },
  { timestamps: true }
)

const user = mongoose.model("User", userSchema, "user")

module.exports = { User: user }
