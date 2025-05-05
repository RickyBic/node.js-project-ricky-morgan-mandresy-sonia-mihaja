const express = require("express");
const router = express.Router();
const {
  getAveragePerCourse,
  getGradeDistribution,
} = require("../controllers/dashboardController");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get(
  "/average-per-course/:id",
  requireRole(["ADMIN", "SCOLARITE", "STUDENT"]),
  getAveragePerCourse
);
router.get(
  "/grade-distribution/:id",
  requireRole(["ADMIN", "SCOLARITE", "STUDENT"]),
  getGradeDistribution
);

module.exports = router;
