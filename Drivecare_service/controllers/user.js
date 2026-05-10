const users = require("../models/user");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { transporter } = require("../Utils/sendmails");

dotenv.config();

const handlecreateuser = async (req, res) => {
  const { name, mobileno, email, role } = req.body;

  if (!name || !email) {
    return res.status(400).json({ msg: "Enter name and email!" });
  }

  const otp = Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const otpExpiresAt = new Date(now.getTime() + 5 * 60 * 1000);
  const mailoptions = {
    from: {
      name: "Drivecare",
      address: process.env.EMAIL,
    },
    to: email,
    subject: "One time password",
    text: `Your OTP is ${otp}`,
  };

  try {
    let user = await users.findOne({ name, email });

    if (!user) {
      const emailExists = await users.findOne({ email });
      if (emailExists) {
        return res
          .status(400)
          .json({ msg: "Email is already registered with a different name." });
      }

      user = await users.create({
        name,
        mobileno,
        email,
        otp,
        otpExpiresAt,
        otpRequestedAt: now,
        role,
      });

      try {
        await transporter.sendMail(mailoptions);
      } catch (mailError) {
        console.error("OTP email send error:", mailError);
        return res.status(500).json({ msg: "Unable to send OTP email" });
      }

      return res.status(201).json({
        msg: "User account created, enter the OTP sent to your mail",
        userid: user._id,
      });
    }

    if (user.otpRequestedAt && now - user.otpRequestedAt < 2 * 60 * 1000) {
      return res
        .status(429)
        .json({ msg: "OTP request too soon. Try again in a few minutes." });
    }

    const updateResult = await users.updateOne(
      { email },
      {
        $set: {
          otp,
          otpExpiresAt,
          otpRequestedAt: now,
        },
      },
    );

    if (!updateResult.acknowledged || updateResult.modifiedCount === 0) {
      console.error("Failed to update OTP for existing user:", email);
      return res.status(500).json({ msg: "Unable to generate OTP" });
    }

    try {
      await transporter.sendMail(mailoptions);
    } catch (mailError) {
      console.error("OTP email send error:", mailError);
      return res.status(500).json({ msg: "Unable to send OTP email" });
    }

    return res.status(200).json({ msg: "OTP sent successfully" });
  } catch (error) {
    if (error.code === 11000 && error.keyValue?.email) {
      console.warn(
        "Duplicate email on create, resending OTP for existing user:",
        email,
      );
      const existingUser = await users.findOne({ name, email });

      if (existingUser) {
        if (
          existingUser.otpRequestedAt &&
          now - existingUser.otpRequestedAt < 2 * 60 * 1000
        ) {
          return res
            .status(429)
            .json({ msg: "OTP request too soon. Try again in a few minutes." });
        }

        await users.updateOne(
          { email },
          {
            $set: {
              otp,
              otpExpiresAt,
              otpRequestedAt: now,
            },
          },
        );

        try {
          await transporter.sendMail(mailoptions);
        } catch (mailError) {
          console.error("OTP email send error:", mailError);
          return res.status(500).json({ msg: "Unable to send OTP email" });
        }

        return res.status(200).json({ msg: "OTP sent successfully" });
      }

      return res
        .status(400)
        .json({ msg: "Email is already registered with a different name." });
    }

    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const veriftotp = async (req, res) => {
  const { otp, email } = req.body;
  const key = process.env.KEY;
  const user = await users.findOne({ email });

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  if (!user.otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    return res.status(400).json({ msg: "OTP expired or invalid" });
  }

  if (user.otp !== Number(otp)) {
    return res.status(400).json({ msg: "Invalid otp" });
  }

  const token = jwt.sign(
    {
      id: user._id,
      name: user.name,
      mobileno: user.mobileno,
      role: user.role,
    },
    key,
    { expiresIn: "7d" },
  );

  res.cookie("token", token);
  await users.updateOne(
    { email: email },
    { $set: { otp: null, otpExpiresAt: null, otpRequestedAt: null } },
  );
  res.status(200).json({ msg: "otp verified", token: token });
};

const handlechangeuserdetails = async (req, res) => {};

const handlelogout = (req, res) => {
  return res.status(200).clearCookie("token").json({ msg: "Logged out successfully" });
};

module.exports = {
  handlecreateuser,
  // handlegetuserbyID,
  handlechangeuserdetails,
  veriftotp,
  handlelogout,
};
