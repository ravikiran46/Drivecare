const express = require("express");
const { isAdmin } = require("../middlewares/authentication");
const {
  get_services,
  post_service,
  update_service,
  delete_service,
  get_services_byId,
} = require("../controllers/Services");
const router = express.Router();

router.route("/").post(isAdmin, post_service).get(get_services);

router
  .route("/:id")
  .get(get_services_byId)
  .put(isAdmin, update_service)
  .delete(isAdmin, delete_service);

module.exports = router;
