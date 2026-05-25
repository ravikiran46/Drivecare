const Router = require("express").Router();

const {
  createTImeslot,
  get_all_Timeslots,
  get_active_Timeslots,
  update_timeslot,
  delete_timeslot,
} = require("../controllers/Timeslot");

const { isAdmin } = require("../middlewares/authentication");

Router.route("/").post(createTImeslot, isAdmin).get(get_all_Timeslots, isAdmin);

Router.route("/active").get(get_active_Timeslots);
Router.route("/:id")
  .put(update_timeslot, isAdmin)
  .delete(delete_timeslot, isAdmin);

module.exports = Router;
