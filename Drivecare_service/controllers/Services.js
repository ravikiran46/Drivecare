const service = require("../models/Services");

const post_service = async (req, res) => {
  const { service_name, price, category, details, imgURL } = req.body;
  if (!service_name || !price || !category || !details || !imgURL) {
    return res.status(203).json({ msg: "All feilds are required!" });
  }
  try {
    let value = Number(price);
    const data = await service.create({
      service_name,
      price: value,
      category,
      details,
      imgURL,
    });
    return res.status(201).json({
      msg: "service added succesfully",
      data: { service_name, price, category, details, imgURL },
    });
  } catch (error) {
    console.log(error);
    return res.stauts(500).json({ msg: "An error occured try after sometime" });
  }
};

const get_services = async (req, res) => {
  try {
    const data = await service.find({});
    if (!data) return res.status(404).json({ msg: "cannot get the data" });
    res.status(200).json({ data: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "An error occured try after sometime" });
  }
};

const get_services_byId = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await service.find({ _id: id });
    if (!data) return res.status(404).json({ msg: "cannot get the data" });
    res.status(200).json({ data: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "An error occured try after sometime" });
  }
};

const update_service = async (req, res) => {
  const { id } = req.params;
  const { service_name, price, category, details, imgURL } = req.body;
  if (!id) {
    return res.status(203).json({ msg: "ID must be provided" });
  }
  const updatedfeilds = {};
  if (service_name) updatedfeilds.service_name = service_name;
  if (price) updatedfeilds.price = price;
  if (category) updatedfeilds.category = category;
  if (details) updatedfeilds.details = details;
  if (details) updatedfeilds.details = details;

  if (Object.keys(updatedfeilds).length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  try {
    const updated_data = await service.updateOne(
      { _id: id },
      {
        $set: updatedfeilds,
      }
    );

    if (updated_data.matchedCount === 0) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({
      message: "Service updated successfully",
      data: { ...updatedfeilds, _id: id },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the service" });
  }
};

const delete_service = async (req, res) => {
  try {
    const { id } = req.params;

    const del_res = await service.deleteOne({ _id: id });

    if (del_res.deletedCount === 0) {
      return res.status(404).json({ msg: "Service not found" });
    }
    return res.status(200).json({ msg: "Service deleted successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "An error occurred while deleting the service " });
  }
};
module.exports = {
  post_service,
  get_services,
  update_service,
  delete_service,
  get_services_byId,
};
