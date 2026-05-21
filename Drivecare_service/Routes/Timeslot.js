const Router = require("express").Router();

const {
  createTImeslot,
  get_all_Timeslots,
  get_active_Timeslots,
  update_timeslot,
  delete_timeslot,
} = require("../controllers/Timeslot");

const { isAdmin } = require("../middlewares/authentication");

Router.use(isAdmin);

Router.route("/").post(createTImeslot).get(get_all_Timeslots);

Router.route("/active").get(get_active_Timeslots);
Router.route("/:id").put(update_timeslot).delete(delete_timeslot);

module.exports = Router;
