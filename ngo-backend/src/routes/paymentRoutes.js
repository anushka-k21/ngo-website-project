const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { verifyPayment } = require("../controllers/paymentController");

const router = express.Router();

router.post("/verify", authMiddleware, verifyPayment);

module.exports = router;
