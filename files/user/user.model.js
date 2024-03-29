const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    username: {
      type: String,
    },
    password: { type: String },
    profileImage: { type: String },
    description: { type: String },
    personalization: {
      expertise: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
      },
      learningGoals: { type: String },
    },
    personalDetails: {
      firstName: { type: String },
      lastName: { type: String },
      dateOfBirth: { type: String },
      gender: { type: String, enum: ["male", "female", "others"] },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationOtp: {
      type: string,
    },
  },
  { timestamps: true }
);

const user = mongoose.model("User", userSchema, "user");

module.exports = { User: user };
