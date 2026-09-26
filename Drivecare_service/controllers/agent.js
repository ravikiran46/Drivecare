const Booking = require("../models/bookings");
const Job = require("../models/Job");
const Agent = require("../models/agent");
const { decryptOtp, safeEqual } = require("../Utils/otp");

const { uploadPhoto } = require("../Utils/cloudinary");

const get_job = async (req, res, next) => {
  try {
    const jobs = await Job.find({ agent: req.agent._id })
      .populate({
        path: "booking",
        populate: [
          { path: "service" },
          { path: "customer", select: "name phone email" },
        ],
      })
      .sort({ createdAt: -1 });
    if (!jobs) return next(new ServerError("Cannot get jobs", 404));
    res.status(200).json(jobs);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const get_job_by_id = async (req, res, next) => {
  if (!req.params.id) return res.status(400).json({ error: "Missing id" });
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      agent: req.agent._id,
    }).populate({
      path: "booking",
      populate: [
        { path: "service" },
        { path: "customer", select: "name phone email" },
      ],
    });
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const start_job = async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, agent: req.agent._id });
    if (!job) return res.status(404).json({ error: "Job not found" });
    if (job.stage !== "pickup")
      return res.status(400).json({ error: "Already started" });

    job.pickup.startedAt = new Date();
    job.timeline.push({
      stage: "pickup",
      label: "Job started — heading to pickup",
      actor: req.agent._id,
      actorModel: "Agent",
    });
    await job.save();

    await Booking.findByIdAndUpdate(job.booking, { status: "in_progress" });

    res.status(200).json({ ok: true, stage: job.stage });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const attachPhoto = async (req, res, stage) => {
  const job = await Job.findOne({ _id: req.params.id, agent: req.agent._id });
  if (!job) return res.status(404).json({ error: "Job not found" });
  if (job.stage !== stage)
    return res.status(400).json({ error: `Not in ${stage} stage` });

  const { file, label, lat, lng } = req.body;
  if (!file) return res.status(400).json({ error: "No file" });

  try {
    const uploaded = await uploadPhoto(file);

    const photo = {
      ...uploaded,
      label: label || "",
      capturedBy: req.agent._id,
      location:
        typeof lat === "number" && typeof lng === "number"
          ? { type: "Point", coordinates: [lng, lat] }
          : undefined,
    };

    job[stage].photos.push(photo);
    await job.save();

    res.status(200).json(job[stage].photos[job[stage].photos.length - 1]);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const checklist = async (req, res) => {
  const { stage } = req.params;
  if (!["pickup", "service", "delivery"].includes(stage)) {
    return res.status(400).json({ error: "Invalid stage" });
  }

  try {
    const job = await Job.findOne({ _id: req.params.id, agent: req.agent._id });
    if (!job) return res.status(404).json({ error: "Job not found" });

    job[stage].checklist = Array.isArray(req.body.items) ? req.body.items : [];
    if (stage === "pickup") {
      job.pickup.odometer = req.body.odometer ?? job.pickup.odometer;
      job.pickup.fuelLevel = req.body.fuelLevel ?? job.pickup.fuelLevel;
      job.pickup.notes = req.body.notes ?? job.pickup.notes;
    }
    if (stage === "delivery") {
      job.delivery.odometer = req.body.odometer ?? job.delivery.odometer;
      job.delivery.fuelLevel = req.body.fuelLevel ?? job.delivery.fuelLevel;
      job.delivery.notes = req.body.notes ?? job.delivery.notes;
      job.delivery.receivedBy = req.body.receivedBy ?? job.delivery.receivedBy;
      job.delivery.relationship =
        req.body.relationship ?? job.delivery.relationship;
    }

    await job.save();
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const verifyStageOtp = async (req, res, stage) => {
  const entered = req.body.otp;
  if (!entered) return res.status(400).json({ error: "Missing otp" });

  const job = await Job.findOne({
    _id: req.params.id,
    agent: req.agent._id,
  }).select(`+${stage}.otp.ciphertext +${stage}.otp.iv +${stage}.otp.authTag`);
  if (!job) return res.status(404).json({ error: "Job not found" });

  const otp = job[stage].otp;
  if (!otp) return res.status(400).json({ error: "OTP not on file" });
  if (otp.lockedUntil && otp.lockedUntil > new Date()) {
    return res.status(423).json({ error: "Locked. Try later." });
  }
  if (otp.expiresAt < new Date())
    return res.status(410).json({ error: "OTP expired" });

  const plain = decryptOtp({
    ciphertext: otp.ciphertext,
    iv: otp.iv,
    authTag: otp.authTag,
  });

  if (!safeEqual(plain, String(entered))) {
    otp.attempts += 1;
    if (otp.attempts >= otp.maxAttempts) {
      otp.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
    }
    await job.save();
    await audit.log({
      action: `${stage}.otp.failed`,
      entity: "Job",
      entityId: job._id,
      actor: req.agent._id,
      actorModel: "Agent",
      after: { attempts: otp.attempts },
      req,
    });
    return res.status(400).json({ error: "Invalid OTP" });
  }

  otp.verifiedAt = new Date();
  otp.verifiedBy = req.agent._id;

  if (stage === "pickup") {
    job.pickup.completedAt = new Date();
    job.service.startedAt = new Date();
    job.stage = "service";
  } else if (stage === "delivery") {
    job.delivery.completedAt = new Date();
    job.completedAt = new Date();
    job.stage = "completed";
    await Booking.findByIdAndUpdate(job.booking, { status: "completed" });
    await Agent.findByIdAndUpdate(job.agent, {
      currentJob: null,
      isAvailable: true,
    });
  }

  job.timeline.push({
    stage,
    label: `${stage} OTP verified`,
    actor: req.agent._id,
    actorModel: "Agent",
  });
  await job.save();
  res.json({ ok: true, stage: job.stage });
};

const change_stage = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, agent: req.agent._id });
    if (!job) return res.status(404).json({ error: "Job not found" });
    if (job.stage !== "service")
      return res.status(400).json({ error: "Not in service stage" });

    job.service.completedAt = new Date();
    job.delivery.startedAt = new Date();
    job.stage = "delivery";
    job.timeline.push({
      stage: "delivery",
      label: "Service complete — ready for delivery",
      actor: req.agent._id,
      actorModel: "Agent",
    });
    await job.save();
    res.json({ ok: true, stage: job.stage });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  get_job,
  get_job_by_id,
  start_job,
  attachPhoto,
  checklist,
  verifyStageOtp,
  change_stage,
};
