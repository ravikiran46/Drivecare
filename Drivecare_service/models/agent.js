const mongoose = require("mongoose");

const agentSchema = mongoose.Schema(
  {
    details: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    isavailable: {
      type: Boolean,
      required: true,
    },
    work: [
      {
        service: {
          type: String,
        },
        location: {
          type: String,
        },
        vehicle_no: {
          type: String,
        },
        info: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("agent", agentSchema);
