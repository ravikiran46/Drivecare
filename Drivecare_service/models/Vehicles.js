const mongoose = require("mongoose");

const Vehicle_Schema = mongoose.Schema({
  user_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  category: {
    type: String,
    enum: ["car", "bike"],
  },
  vehicle_number: {
    type: String,
  },
  brand: {
    type: String,
  },
  model: {
    type: String,
  },
  variant: {
    type: String,
  },
  color: {
    type: String,
  },
});

module.exports = mongoose.model("vehicle", Vehicle_Schema);
