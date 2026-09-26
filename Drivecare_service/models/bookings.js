const mongoose = require("mongoose");

const GeoPointSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
  },
  { _id: false },
);
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
      name: String,
      phone: String,
      line: String,
      city: String,
      car: String,
      location: GeoPointSchema,
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
      enum: ["scheduled", "assigned", "in_progress", "completed", "cancelled"],
      default: "scheduled",
    },
    agent_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "agent",
      default: null,
      index: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
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
