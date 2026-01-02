require("dotenv").config();   // 👈 MUST be first
console.log("ENV CHECK:", process.env.MONGO_URI);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// 🔴 ADD THIS DEBUG LINE (important)
console.log("Mongo URI:", process.env.MONGO_URI);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("MongoDB connection error ❌", err));

//

// routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// test route (IMPORTANT)
app.get("/", (req, res) => {
  res.send("SafeRoute backend is running 🚀");
});

// start server (THIS WAS MISSING)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


const contactRoutes = require("./routes/contacts");
app.use("/api/contacts", contactRoutes);