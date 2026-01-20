const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const donationRoutes = require("./routes/donationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

//Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

//Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

//Health Check
app.get("/", (req, res) => {
  res.send("NGO Backend API is running");
});

module.exports = app;
