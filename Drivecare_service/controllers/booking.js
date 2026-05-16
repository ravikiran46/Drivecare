const bookings = require("../models/bookings");

const create_booking = async (req, res) => {
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
    return res.status(400).json({ message: "All fields are required" });
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
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Failed to create booking", error: error.message });
  }
};

const get_user_booking = async (req, res) => {
  try {
    const data = await bookings
      .find({ user_Id: req.user.id })
      .populate("service_Id")
      .populate("vehicle_Id")
      .populate("address_Id")
      .populate("agent_Id")
      .sort({ createdAt: -1 });
    if (!data) return res.status(404).json({ msg: "cannot get the data" });
    res.status(200).json({ data: data });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Failed to get booking", error: error.message });
  }
};

const get_all_bookings = async (req, res) => {
  try {
    const data = await bookings
      .find()
      .populate("service_Id")
      .populate("vehicle_Id")
      .populate("address_Id")
      .populate("agent_Id")
      .sort({ createdAt: -1 });
    if (!data) return res.status(404).json({ msg: "cannot get the data" });
    res.status(200).json({ data: data });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Failed to get bookings", error: error.message });
  }
};

const update_bookings = async (req, res) => {
  const { id } = req.params;
  const { status, agent_Id } = req.body;

  if (!status || !agent_Id) {
    return res
      .status(400)
      .json({ message: "Status and agent_Id are required" });
  }
  try {
    const data = await bookings.findByIdAndUpdate(
      id,
      { status, agent_Id },
      { new: true },
    );
    if (!data)
      return res
        .status(404)
        .json({ msg: `cannot update the data with this ${id}` });
    res.status(200).json({ msg: "Booking updated successfully", data: data });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Failed to update booking", error: error.message });
  }
};

const update_booking_by_user = async (req, res) => {
  const { id } = req.params;
  const { date, time, notes, address_Id, serviceId, vehicle_Id } = req.body;
  try {
    const data = await bookings.findByIdAndUpdate(
      id,
      { date, time, notes, address_Id, serviceId, vehicle_Id },
      { new: true },
    );
    if (!data)
      return res
        .status(404)
        .json({ msg: `cannot update the data with this ${id}` });
    res.status(200).json({ msg: "Booking updated successfully", data: data });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Failed to update booking", error: error.message });
  }
};

const delete_booking = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await bookings.findByIdAndDelete(id);
    if (!data)
      return res
        .status(404)
        .json({ msg: `cannot delete the data with this ${id}` });
    res.status(200).json({ msg: "Booking deleted successfully", data: data });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Failed to delete booking", error: error.message });
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
