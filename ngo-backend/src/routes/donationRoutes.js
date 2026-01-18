
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createDonation,
  getUserDonations,
} = require("../controllers/donationController");

const router = express.Router();

router.post("/", authMiddleware, createDonation);
router.get("/my", authMiddleware, getUserDonations);

module.exports = router;

