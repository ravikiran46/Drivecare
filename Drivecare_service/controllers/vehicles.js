const vehicle_model = require("../models/Vehicles");

const post_vehicle = async (req, res) => {
  const { category, vehicle_number, brand, model, variant, color } = req.body;

  try {
    const data = await vehicle_model.create({
      user_Id: req.user.id,
      category,
      vehicle_number,
      brand,
      model,
      variant,
      color,
    });
    return res.status(201).json({
      msg: "vehicle added succesfully",
      data: { category, vehicle_number, brand, model, variant, color },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "An error occured while adding vehicle try after sometime",
    });
  }
};

const get_vehicle = async (req, res) => {
  try {
    const data = await vehicle_model.find({ user_Id: req.user.id });
    if (!data) return res.status(404).json({ msg: "cannot get the data" });
    res.status(200).json({ data: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "An error occured try after sometime" });
  }
};

const update_vehicle = async (req, res) => {
  const { id } = req.params;
  const { category, vehicle_number, brand, model, variant, color } = req.body;
  if (!id) {
    return res.status(400).json({ msg: "ID must be provided" });
  }
  const updatedfeilds = {};
  if (vehicle_number) updatedfeilds.vehicle_number = vehicle_number;
  if (brand) updatedfeilds.brand = brand;
  if (model) updatedfeilds.model = model;
  if (variant) updatedfeilds.variant = variant;
  if (color) updatedfeilds.color = color;
  if (category) updatedfeilds.category = category;

  if (Object.keys(updatedfeilds).length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  try {
    const updated_data = await vehicle_model.updateOne(
      { _id: id },
      {
        $set: updatedfeilds,
      },
    );

    if (updated_data.matchedCount === 0) {
      return res.status(404).json({ message: "vehicle not found" });
    }
    res.status(200).json({
      message: "vehicle data updated successfully",
      data: { ...updatedfeilds, _id: id },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the service" });
  }
};

const delete_vehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const del_res = await vehicle_model.deleteOne({ _id: id });

    if (del_res.deletedCount === 0) {
      return res.status(404).json({ msg: "vehicle not found" });
    }
    return res.status(200).json({ msg: "vehicle deleted successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "An error occurred while deleting the service " });
  }
};

module.exports = {
  post_vehicle,
  get_vehicle,
  update_vehicle,
  delete_vehicle,
};
