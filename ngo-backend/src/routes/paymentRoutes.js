const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createOrder,
  verifyPayment,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/create-order", authMiddleware, createOrder);
router.post("/verify", authMiddleware, verifyPayment);

module.exports = router;
