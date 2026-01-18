const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  getAllUsers,
  getAllDonations,
  getStats,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/users", authMiddleware, roleMiddleware("ADMIN"), getAllUsers);
router.get("/donations", authMiddleware, roleMiddleware("ADMIN"), getAllDonations);
router.get("/stats", authMiddleware, roleMiddleware("ADMIN"), getStats);

module.exports = router;

const { exportUsersCSV } = require("../controllers/adminController");

router.get(
  "/export/users",
  authMiddleware,
  roleMiddleware("ADMIN"),
  exportUsersCSV
);
