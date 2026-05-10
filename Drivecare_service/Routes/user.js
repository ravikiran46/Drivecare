const express = require("express");
const {
  handlecreateuser,
  veriftotp,
  handlechangeuserdetails,
  handlelogout,
} = require("../controllers/user");
const { verify, isAdmin, isUser } = require("../middlewares/authentication");

const router = express.Router();

router.route("/login").post(handlecreateuser);

router.post("/verifyotp", veriftotp);

router.post("/user/logout", handlelogout);

router.patch("/user/:id", verify, isUser, handlechangeuserdetails);

module.exports = router;
