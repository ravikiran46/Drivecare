const Timeslot = require("../models/Timeslot");
const ServerError = require("../Utils/ServerError");

const createTImeslot = async (req, res, next) => {
  const { slot } = req.body;

  if (!slot) {
    return next(new ServerError("Slot is required", 400));
  }

  try {
    const existingtimeslot = await Timeslot.findOne({ slot: slot });
    if (existingtimeslot) {
      return next(new ServerError("Timeslot already exists", 400));
    }
    const timeslot = await Timeslot.create({ slot: slot });
    res
      .status(201)
      .json({ msg: "Timeslot created successfully", data: timeslot });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const get_all_Timeslots = async (req, res, next) => {
  try {
    const timeslots = await Timeslot.find();
    if (!timeslots) {
      return next(new ServerError("Cannot get the data", 404));
    }
    return res.status(200).json({ data: timeslots });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const get_active_Timeslots = async (req, res, next) => {
  try {
    const timeslots = await Timeslot.find({ isactive: true }).sort({
      slot: 1,
    });
    if (!timeslots) {
      return next(new ServerError("Cannot get the data", 404));
    }
    return res.status(200).json({ data: timeslots });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const update_timeslot = async (req, res, next) => {
  const { id } = req.params;
  const { isactive } = req.body;
  if (!id || id.length !== 24) {
    return next(new ServerError("Invalid timeslot id", 400));
  }
  const timeslot = await Timeslot.findById(id);
  if (!timeslot) {
    return next(
      new ServerError(`Cannot find the timeslot with this ${id}`, 404),
    );
  }
  if (isactive === undefined) {
    return next(new ServerError("isactive is required", 400));
  }
  try {
    const data = await Timeslot.findByIdAndUpdate(
      id,
      { isactive },
      { new: true },
    );
    if (!data)
      return next(
        new ServerError(`Cannot update the data with this ${id}`, 404),
      );
    res.status(200).json({ msg: "Timeslot updated successfully", data: data });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const delete_timeslot = async (req, res, next) => {
  const { id } = req.params;
  if (!id || id.length !== 24) {
    return next(new ServerError("Invalid timeslot id", 400));
  }
  try {
    const data = await Timeslot.findByIdAndDelete(id);
    if (!data)
      return next(
        new ServerError(`Cannot delete the data with this ${id}`, 404),
      );
    res.status(200).json({ msg: "Timeslot deleted successfully", data: data });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  createTImeslot,
  get_all_Timeslots,
  get_active_Timeslots,
  update_timeslot,
  delete_timeslot,
};
