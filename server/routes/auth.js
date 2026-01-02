const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Otp = require("../models/Otp");

const router = express.Router();

/* ----------------------------------
   SEND OTP (EMAIL ONLY)
---------------------------------- */
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    // DEV ONLY — replace with Nodemailer later
    console.log("OTP for", email, ":", otp);

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ----------------------------------
   SIGNUP (EMAIL + OTP)
---------------------------------- */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // strong password validation
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    if (!strongPassword.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      });
    }

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: true,
    });

    await Otp.deleteMany({ email });

    res.status(201).json({
      message: "Signup successful",
      userId: user._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ----------------------------------
   LOGIN (EMAIL + PASSWORD)
---------------------------------- */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
