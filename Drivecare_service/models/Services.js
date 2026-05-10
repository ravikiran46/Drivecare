const mongoose = require("mongoose");
const ServiceSchema = mongoose.Schema(
  {
    service_name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    imgURL: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("service", ServiceSchema);
