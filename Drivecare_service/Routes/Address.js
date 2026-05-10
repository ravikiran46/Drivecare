const express = require("express");

const router = express.Router();

const {
  post_address,
  delete_address,
  get_address,
  update_address,
} = require("../controllers/Address");

router.route("/").post(post_address).get(get_address);

router.route("/:id").put(update_address).delete(delete_address);

module.exports = router;
