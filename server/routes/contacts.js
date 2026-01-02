const express = require("express");
const Contact = require("../models/Contact");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/* GET CONTACTS */
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({
      userId: req.user.userId,
    });
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ADD CONTACT */
router.post("/", auth, async (req, res) => {
  try {
    const { name, email, relation } = req.body;

    const contact = await Contact.create({
      userId: req.user.userId,
      name,
      email,
      relation,
    });

    res.status(201).json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* DELETE CONTACT */
router.delete("/:id", auth, async (req, res) => {
  try {
    await Contact.deleteOne({
      _id: req.params.id,
      userId: req.user.userId,
    });
    res.json({ message: "Contact removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
