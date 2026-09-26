const Booking = require("../models/bookings");
const Job = require("../models/Job");
const Agent = require("../models/agent");

const assignJob = async (req, res) => {
  const { bookingId, agentId } = req.body;
  const booking = await Booking.findById(bookingId);
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  if (booking.agent) return res.status(409).json({ error: "Already assigned" });

  try {
    const agent = await Agent.findOne({
      _id: agentId,
      status: "active",
      currentJob: null,
    });
    if (!agent) return res.status(400).json({ error: "Agent unavailable" });

    const job = await Job.findById(booking.job);
    job.agent = agent._id;
    await job.save();

    booking.agent = agent._id;
    booking.status = "assigned";
    await booking.save();

    agent.currentJob = job._id;
    agent.isAvailable = false;
    await agent.save();

    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { assignJob };
