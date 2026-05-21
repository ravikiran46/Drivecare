const mongoose = require("mongoose");

const TimeslotSchema = new mongoose.Schema(
  {
    slot: {
      type: String,
      required: true,
      unique: true,
    },
    isactive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Timeslot", TimeslotSchema);
