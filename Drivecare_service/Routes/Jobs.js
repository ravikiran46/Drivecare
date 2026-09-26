const express = require("express");

const { assignJob } = require("../controllers/Job");

const router = express.Router();

router.route("/assign").post(assignJob);
module.exports = router;
