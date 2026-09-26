const express = require("express");
const router = express.Router();
const {
  attachPhoto,
  change_stage,
  checklist,
  get_job,
  get_job_by_id,
  start_job,
  verifyStageOtp,
} = require("../controllers/agent");

router.route("/").get(get_job);

router.route("/agents/jobs/:id").get(get_job_by_id).post(start_job);

router
  .route("/jobs/:id/pickup/photos")
  .post((req, res) => attachPhoto(req, res, "pickup"));
router
  .route("/jobs/:id/service/photos")
  .post((req, res) => attachPhoto(req, res, "service"));
router
  .route("/jobs/:id/delivery/photos")
  .post((req, res) => attachPhoto(req, res, "delivery"));

router.route("/jobs/:id/:stage/checklist").post(checklist);

router
  .route("/jobs/:id/pickup/verify-otp")
  .post((req, res) => verifyStageOtp(req, res, "pickup"));
router
  .route("/jobs/:id/delivery/verify-otp")
  .post((req, res) => verifyStageOtp(req, res, "delivery"));

router.route("/jobs/:id/service/complete").post(change_stage);

module.exports = router;
