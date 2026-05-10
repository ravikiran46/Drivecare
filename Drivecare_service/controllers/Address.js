const Address_model = require("../models/Address");

const post_address = async (req, res) => {
  const { flat_no, block_no, parking_no, landmark, address_category } =
    req.body;

  try {
    const data = await Address_model.create({
      user_Id: req.user.id,
      flat_no,
      block_no,
      parking_no,
      landmark,
      address_category,
    });
    return res.status(201).json({
      msg: "Address added succesfully",
      data: { flat_no, block_no, parking_no, landmark, address_category },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "An error occured while adding address try after sometime",
    });
  }
};

const get_address = async (req, res) => {
  try {
    const data = await Address_model.find({ user_Id: req.user.id });
    if (!data) return res.status(404).json({ msg: "cannot get the data" });
    res.status(200).json({ data: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "An error occured try after sometime" });
  }
};

const update_address = async (req, res) => {
  const { id } = req.params;
  const { flat_no, block_no, parking_no, landmark, address_category } =
    req.body;
  if (!id) {
    return res.status(400).json({ msg: "ID must be provided" });
  }
  const updatedfeilds = {};
  if (flat_no) updatedfeilds.flat_no = flat_no;
  if (block_no) updatedfeilds.block_no = block_no;
  if (parking_no) updatedfeilds.parking_no = parking_no;
  if (landmark) updatedfeilds.landmark = landmark;
  if (address_category) updatedfeilds.address_category = address_category;

  if (Object.keys(updatedfeilds).length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  try {
    const updated_data = await Address_model.updateOne(
      { _id: id },
      {
        $set: updatedfeilds,
      },
    );

    if (updated_data.matchedCount === 0) {
      return res.status(404).json({ message: "address not found" });
    }
    res.status(200).json({
      message: "address updated successfully",
      data: { ...updatedfeilds, _id: id },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the address" });
  }
};

const delete_address = async (req, res) => {
  try {
    const { id } = req.params;
    const del_res = await Address_model.deleteOne({ _id: id });

    if (del_res.deletedCount === 0) {
      return res.status(404).json({ msg: "address not found" });
    }
    return res.status(200).json({ msg: "address deleted successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "An error occurred while deleting the address " });
  }
};

module.exports = {
  post_address,
  get_address,
  update_address,
  delete_address,
};
