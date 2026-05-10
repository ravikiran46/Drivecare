const express = require("express");

const {
  post_vehicle,
  get_vehicle,
  update_vehicle,
  delete_vehicle,
} = require("../controllers/vehicles");

const router = express.Router();

router.route("/").post(post_vehicle).get(get_vehicle);

router.route("/:id").put(update_vehicle).delete(delete_vehicle);

module.exports = router;
