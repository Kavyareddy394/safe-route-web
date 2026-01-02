const express = require("express");
const Contact = require("../models/Contact");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// PROTECTED ROUTE
router.get("/", auth, async (req, res) => {
  const contacts = await Contact.find({ userId: req.user.userId });
  res.json(contacts);
});

// PROTECTED ROUTE
router.post("/", auth, async (req, res) => {
  const { name, email } = req.body;

  const contact = await Contact.create({
    userId: req.user.userId,
    name,
    email,
  });

  res.status(201).json(contact);
});

module.exports = router;
