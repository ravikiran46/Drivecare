const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    vehicle: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    service_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "service",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "in_progress", "completed", "cancelled"],
      default: "scheduled",
    },
    agent_Id: {
      type: String,
      // ref: "agent",
      default: null,
    },
    total_price: {
      type: Number,
      required: true,
    },
    payment_method: {
      type: String,
      enum: ["cod"],
      default: "cod",
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("bookings", bookingSchema);
