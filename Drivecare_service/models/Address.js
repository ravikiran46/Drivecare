const mongoose = require("mongoose");

const Address_Schema = mongoose.Schema(
  {
    user_Id: {
      type: mongoose.mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    flat_no: {
      type: String,
    },
    block_no: {
      type: String,
    },
    parking_no: {
      type: String,
    },
    landmark: {
      type: String,
    },
    address_category: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("address", Address_Schema);
