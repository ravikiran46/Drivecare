const router = require("express").Router();

const {
  create_booking,
  get_user_booking,
  get_all_bookings,
  update_booking_by_user,
  update_bookings,
  delete_booking,
} = require("../controllers/booking");

const { isAdmin } = require("../middlewares/authentication");

router.route("/").post(create_booking).get(get_user_booking);

router.route("/all").get(isAdmin, get_all_bookings);

router.route("/:id/status").put(isAdmin, update_bookings);

router.route("/:id/cancel").delete(delete_booking);

router.route("/user/:id").put(update_booking_by_user);

module.exports = router;
