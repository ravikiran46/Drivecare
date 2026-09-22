const crypto = require("crypto");
const users = require("../models/user");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { transporter } = require("../Utils/sendmails");

dotenv.config();

const OTP_LENGTH = 6;
const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_RESEND_DELAY_MS = 30 * 1000;

const generateOtp = () =>
  String(Math.floor(100000 + Math.random() * 900000)).padStart(OTP_LENGTH, "0");

const hashOtp = (otp) => crypto.createHash("sha256").update(otp).digest("hex");

const isEmailValid = (value) => /^\S+@\S+\.\S+$/.test(value);
const isMobileValid = (value) => /^[0-9]{7,15}$/.test(value);

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: {
      name: "Car Service",
      address: process.env.EMAIL,
    },
    to: email,
    subject: "Your OTP for Car Service",
    text: `Your one-time password is ${otp}. It expires in 5 minutes.`,
  };

  return transporter.sendMail(mailOptions);
};

const handlecreateuser = async (req, res) => {
  const { name, mobileno, email, role } = req.body || {};
  const trimmedName = typeof name === "string" ? name.trim() : "";
  const normalizedEmail =
    typeof email === "string" ? email.trim().toLowerCase() : "";
  const normalizedMobile = mobileno ? String(mobileno).trim() : undefined;

  if (!trimmedName || !normalizedEmail) {
    return res.status(400).json({ msg: "Name and email are required." });
  }

  if (!isEmailValid(normalizedEmail)) {
    return res.status(400).json({ msg: "Enter a valid email address." });
  }

  // if (normalizedMobile && !isMobileValid(normalizedMobile)) {
  //   return res.status(400).json({ msg: "Enter a valid mobile number." });
  // }
  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const now = new Date();
  const otpExpiresAt = new Date(now.getTime() + OTP_TTL_MS);

  try {
    const existingUser = await users.findOne({ email: normalizedEmail });
    if (existingUser) {
      if (existingUser.name !== trimmedName) {
        return res
          .status(400)
          .json({ msg: "Email is already registered with a different name." });
      }
      if (
        existingUser.otpRequestedAt &&
        now.getTime() - existingUser.otpRequestedAt.getTime() <
          OTP_RESEND_DELAY_MS
      ) {
        return res
          .status(429)
          .json({ msg: "OTP request too soon. Try again in a few minutes." });
      }

      await sendOtpEmail(normalizedEmail, otp);
      await users.updateOne(
        { email: normalizedEmail },
        {
          $set: {
            otp: otpHash,
            otpExpiresAt,
            otpRequestedAt: now,
          },
        },
      );

      return res.status(200).json({ msg: "OTP sent successfully." });
    }

    const user = await users.create({
      name: trimmedName,
      mobileno: normalizedMobile,
      email: normalizedEmail,
      // role: "user",
      otp: otpHash,
      otpExpiresAt,
      otpRequestedAt: now,
    });

    await sendOtpEmail(normalizedEmail, otp);

    return res.status(201).json({
      msg: "User account created, enter the OTP sent to your mail.",
      userid: user._id,
    });
  } catch (error) {
    if (error.code === 11000 && error.keyValue?.email) {
      const existingUser = await users.findOne({ email: normalizedEmail });

      if (existingUser) {
        if (existingUser.name !== trimmedName) {
          return res.status(400).json({
            msg: "Email is already registered with a different name.",
          });
        }

        if (
          existingUser.otpRequestedAt &&
          now.getTime() - existingUser.otpRequestedAt.getTime() <
            OTP_RESEND_DELAY_MS
        ) {
          return res
            .status(429)
            .json({ msg: "OTP request too soon. Try again in a few minutes." });
        }

        await sendOtpEmail(normalizedEmail, otp);
        await users.updateOne(
          { email: normalizedEmail },
          {
            $set: {
              otp: otpHash,
              otpExpiresAt,
              otpRequestedAt: now,
            },
          },
        );

        return res.status(200).json({ msg: "OTP sent successfully." });
      }
    }

    console.error("handlecreateuser error:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};

const veriftotp = async (req, res) => {
  const { otp, email } = req.body || {};
  const normalizedEmail =
    typeof email === "string" ? email.trim().toLowerCase() : "";
  const otpValue = typeof otp === "string" ? otp.trim() : String(otp || "");

  if (!normalizedEmail || !otpValue) {
    return res.status(400).json({ msg: "Email and OTP are required." });
  }

  const user = await users.findOne({ email: normalizedEmail });

  if (!user) {
    return res.status(404).json({ msg: "User not found." });
  }

  if (!user.otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    return res.status(400).json({ msg: "OTP expired or invalid." });
  }

  if (hashOtp(otpValue) !== user.otp) {
    return res.status(400).json({ msg: "Invalid OTP." });
  }

  const token = jwt.sign(
    {
      id: user._id,
      name: user.name,
      mobileno: user.mobileno,
      role: user.role,
    },
    process.env.KEY,
    { expiresIn: "7d" },
  );

  await users.updateOne(
    { email: normalizedEmail },
    { $set: { otp: null, otpExpiresAt: null, otpRequestedAt: null } },
  );

  return res.status(200).json({ msg: "OTP verified.", token });
};

const handlechangeuserdetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const { name, email, mobileno } = req.body;

    const isEmailValid = (value) => /^\S+@\S+\.\S+$/.test(value);

    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();

    if (email !== undefined) {
      if (!isEmailValid(email)) {
        return res.status(400).json({
          msg: "Enter a valid email address.",
        });
      }
      updateData.email = email.trim().toLowerCase();
    }
    if (mobileno !== undefined && !/^[0-9]{10}$/.test(mobileno)) {
      return res.status(400).json({
        msg: "Enter a valid 10-digit phone number.",
      });
    }
    updateData.mobileno = mobileno.trim();

    const updatedUser = await users
      .findByIdAndUpdate(
        userId,
        { $set: updateData },
        {
          new: true,
          runValidators: true,
        },
      )
      .select("-otp -otpExpiresAt -otpRequestedAt");

    if (!updatedUser) {
      return res.status(404).json({
        msg: "User not found.",
      });
    }
    return res.status(200).json({
      msg: "Account updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("handlechangeuserdetails error:", error);

    return res.status(500).json({
      msg: "Failed to update account.",
    });
  }
};

const handlelogout = (req, res) => {
  return res
    .status(200)
    .clearCookie("token")
    .json({ msg: "Logged out successfully." });
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await users
      .findById(req.user.id)
      .select("-otp -otpExpiresAt -otpRequestedAt");

    if (!user) {
      return res.status(404).json({
        msg: "User not found.",
      });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("getCurrentUser error:", error);

    return res.status(500).json({
      msg: "Failed to fetch current user.",
    });
  }
};

module.exports = {
  handlecreateuser,
  handlechangeuserdetails,
  veriftotp,
  handlelogout,
  getCurrentUser,
};
