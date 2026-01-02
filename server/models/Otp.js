const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  otp: {
    type: String, // hashed
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Otp", otpSchema);
