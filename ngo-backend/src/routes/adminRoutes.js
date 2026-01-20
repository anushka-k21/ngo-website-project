

// const express = require("express");
// const router = express.Router();
// const adminController = require("../controllers/adminController");
// const authMiddleware = require("../middleware/authMiddleware");
// const roleMiddleware = require("../middleware/roleMiddleware");

// // Ensure only admins can access these
// router.use(authMiddleware, roleMiddleware("admin"));

// router.get("/stats", adminController.getStats);
// router.get("/users", adminController.getAllUsers);
// router.get("/donations", adminController.getAllDonations);
// router.get("/export-users", adminController.exportUsersCSV);

// module.exports = router;


const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getAllUsers,
  getAllDonations,
  getStats,
  exportUsersCSV,
} = require("../controllers/adminController");

const router = express.Router();

// Changed "ADMIN" to "admin" to match PostgreSQL role entries
router.get("/users", authMiddleware, roleMiddleware("admin"), getAllUsers);
router.get("/donations", authMiddleware, roleMiddleware("admin"), getAllDonations);
router.get("/stats", authMiddleware, roleMiddleware("admin"), getStats);

// Changed /export/users to /export-users to match AdminDashboard.js api call
router.get("/export-users", authMiddleware, roleMiddleware("admin"), exportUsersCSV);

module.exports = router;