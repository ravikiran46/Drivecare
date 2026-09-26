const bookings = require("../models/bookings");
const ServerError = require("../Utils/ServerError");
const job = require("../models/Job");
const Agent = require("../models/agent");
const { generateOtp, buildOtpDoc, decryptOtp } = require("../Utils/otp");

const create_booking = async (req, res, next) => {
  const { vehicle, address, service_Id, date, time, total_price, notes } =
    req.body;

  if (!address?.city || !date || !time || !service_Id || !total_price) {
    return next(new ServerError("All fields are required", 400));
  }
  try {
    const booking = await bookings.create({
      user_Id: req.user.id,
      vehicle,
      address,
      date: Date.parse(date),
      time,
      total_price: Number(total_price),
      service_Id,
      notes,
    });

    const agent = await Agent.findOne({
      city: address.city,
      isAvailable: true,
      status: "active",
      currentJob: null,
    });

    const pickupPlain = generateOtp();
    const deliveryPlain = generateOtp();

    const job = await Job.create({
      booking: booking._id,
      agent: agent ? agent._id : null,
      stage: "pickup",
      startedAt: new Date(),
      pickup: { otp: buildOtpDoc(pickupPlain) },
      delivery: { otp: buildOtpDoc(deliveryPlain) },
      timeline: [
        { stage: "pickup", label: "Job created", actorModel: "System" },
      ],
    });

    booking.job = job._id;
    if (agent) {
      booking.agent = agent._id;
      booking.status = "assigned";
      agent.currentJob = job._id;
      agent.isAvailable = false;
      await agent.save();
    }
    await booking.save();
    res.status(201).json({
      msg: "Booking created successfully",
      data: booking,
      jobId: job._id,
      assigned: !!agent,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const get_user_booking = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return next(new ServerError("User not authenticated", 401));
  }
  try {
    const data = await bookings
      .find({ user_Id: userId })
      .populate("service_Id")
      .populate({ path: "job", select: "stage pickup.otp delivery.otp" })
      .populate("vehicle")
      .populate("address")
      .populate("agent_Id")
      .sort({ createdAt: -1 });
    if (!data) return next(new ServerError("Cannot get the data", 404));
    res.status(200).json({ data: data });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const get_all_bookings = async (req, res, next) => {
  try {
    const data = await bookings
      .find()
      .populate({ path: "user_Id", select: "name email mobileno" })
      .populate("service_Id")
      .populate("vehicle")
      .populate("address")
      .populate("agent_Id")
      .sort({ createdAt: -1 });
    if (!data) return next(new ServerError("Cannot get the data", 404));
    res.status(200).json({ data: data });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const update_bookings = async (req, res, next) => {
  const { id } = req.params;
  const { status, agent_Id } = req.body;

  const booking = await bookings.findById(id);
  if (!booking) {
    return next(
      new ServerError(`Cannot find the booking with this ${id}`, 404),
    );
  }

  if (!status && !agent_Id) {
    return next(new ServerError("Either status or agent_Id is required", 400));
  }
  try {
    const data = await bookings.findByIdAndUpdate(
      id,
      { status, agent_Id },
      { new: true },
    );
    if (!data)
      return next(
        new ServerError(`Cannot update the data with this ${id}`, 404),
      );
    res.status(200).json({ msg: "Booking updated successfully", data: data });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const update_booking_by_user = async (req, res, next) => {
  const { id } = req.params;
  const { date, time, notes, address, serviceId, vehicle } = req.body;

  const booking = await bookings.findById(id);
  if (!booking)
    return next(
      new ServerError(`Cannot find the booking with this ${id}`, 404),
    );

  if (!date && !time && !notes && !address && !serviceId && !vehicle) {
    return next(
      new ServerError("At least one field is required to update", 400),
    );
  }
  try {
    const data = await bookings.findByIdAndUpdate(
      id,
      { date, time, notes, address, serviceId, vehicle },
      { new: true },
    );
    if (!data)
      return next(
        new ServerError(`Cannot update the data with this ${id}`, 404),
      );
    res.status(200).json({ msg: "Booking updated successfully", data: data });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const delete_booking = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await bookings.findByIdAndDelete(id);
    if (!data)
      return next(
        new ServerError(`Cannot delete the data with this ${id}`, 404),
      );
    res.status(200).json({ msg: "Booking deleted successfully", data: data });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  create_booking,
  get_user_booking,
  get_all_bookings,
  update_bookings,
  update_booking_by_user,
  delete_booking,
};
