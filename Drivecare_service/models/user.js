const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address."],
    },
    mobileno: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      match: [/^[0-9]{7,15}$/, "Please provide a valid mobile number."],
    },
    otp: {
      type: String,
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
  { timestamps: true },
);

const users = mongoose.model("user", userSchema);

module.exports = users;
