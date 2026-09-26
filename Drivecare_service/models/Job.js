const mongoose = require("mongoose");

const GeoPointSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
  { _id: false },
);

const PhotoSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    key: { type: String, required: true },
    label: { type: String, default: "" }, // "before" | "during" | "after" | "damage"
    capturedAt: { type: Date, default: Date.now },
    capturedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
    location: GeoPointSchema,
    width: Number,
    height: Number,
    size: Number,
  },
  { _id: true },
);

const ChecklistItemSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    label: String,
    value: mongoose.Schema.Types.Mixed,
    notes: String,
  },
  { _id: false },
);

const OtpSchema = new mongoose.Schema(
  {
    ciphertext: { type: String, required: true, select: false },
    iv: { type: String, required: true, select: false },
    authTag: { type: String, required: true, select: false },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 5 },
    lockedUntil: Date,
    verifiedAt: Date,
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const jobSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
      index: true,
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      default: null,
      index: true,
    },
    stage: {
      type: String,
      enum: [
        "pickup",
        "service",
        "quality_check",
        "delivery",
        "completed",
        "cancelled",
      ],
      default: "pickup",
      index: true,
    },
    startedAt: Date,
    completedAt: Date,

    pickup: {
      startedAt: Date,
      completedAt: Date,
      odometer: Number,
      fuelLevel: {
        type: String,
        enum: ["empty", "quarter", "half", "three_quarter", "full", "na"],
        default: "na",
      },
      notes: String,
      checklist: [ChecklistItemSchema],
      photos: [PhotoSchema],
      location: GeoPointSchema,
      otp: OtpSchema,
    },

    service: {
      startedAt: Date,
      completedAt: Date,
      checklist: [ChecklistItemSchema],
      photos: [PhotoSchema],
      productsUsed: [{ name: String, qty: String }],
      issuesFound: String,
    },

    qualityCheck: {
      passed: Boolean,
      checkedAt: Date,
      checkedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
      notes: String,
    },

    delivery: {
      startedAt: Date,
      completedAt: Date,
      odometer: Number,
      fuelLevel: String,
      notes: String,
      checklist: [ChecklistItemSchema],
      photos: [PhotoSchema],
      location: GeoPointSchema,
      otp: OtpSchema,
      receivedBy: String,
      relationship: String,
    },

    timeline: [
      {
        at: { type: Date, default: Date.now },
        stage: String,
        label: String,
        actor: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "timeline.actorModel",
        },
        actorModel: {
          type: String,
          enum: ["Agent", "User", "Admin", "System"],
          default: "System",
        },
        meta: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true },
);

jobSchema.index({ agent: 1, stage: 1 });
jobSchema.index({ "pickup.otp.expiresAt": 1 });
jobSchema.index({ "delivery.otp.expiresAt": 1 });

module.exports = mongoose.model("Job", jobSchema);
