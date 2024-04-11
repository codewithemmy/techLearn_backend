const mongoose = require("mongoose")

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
      default: "free-user",
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
  },
  { timestamps: true }
)

const user = mongoose.model("User", userSchema, "user")

module.exports = { User: user }
