const bookings = require("../models/bookings");
const ServerError = require("../Utils/ServerError");

const create_booking = async (req, res, next) => {
  const {
    user_Id,
    vehicle_Id,
    address_Id,
    service_Id,
    date,
    time,
    total_price,
    notes,
  } = req.body;
  if (
    !user_Id ||
    !vehicle_Id ||
    !address_Id ||
    !date ||
    !time ||
    !service_Id ||
    !total_price
  ) {
    return next(new ServerError("All fields are required", 400));
  }
  try {
    const booking = await bookings.create({
      user_Id,
      vehicle_Id,
      address_Id,
      date: Date.parse(date),
      time,
      total_price: Number(total_price),
      service_Id,
      notes,
    });
    res
      .status(201)
      .json({ msg: "Booking created successfully", data: booking });
    console.log("Booking created:", booking);
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
      .populate("vehicle_Id")
      .populate("address_Id")
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
      .populate("service_Id")
      .populate("vehicle_Id")
      .populate("address_Id")
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
  const { date, time, notes, address_Id, serviceId, vehicle_Id } = req.body;

  const booking = await bookings.findById(id);
  if (!booking)
    return next(
      new ServerError(`Cannot find the booking with this ${id}`, 404),
    );

  if (!date && !time && !notes && !address_Id && !serviceId && !vehicle_Id) {
    return next(
      new ServerError("At least one field is required to update", 400),
    );
  }
  try {
    const data = await bookings.findByIdAndUpdate(
      id,
      { date, time, notes, address_Id, serviceId, vehicle_Id },
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
