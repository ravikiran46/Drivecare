const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobileno: {
      type: Number,
      unique: true,
    },
    otp: {
      type: Number,
    },
    otpExpiresAt: {
      type: Date,
    },
    otpRequestedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["user", "admin", "agent"],
      default: "user",
    },
  },
  { timestamps: true }
);

const users = mongoose.model("user", userSchema);

module.exports = users;
