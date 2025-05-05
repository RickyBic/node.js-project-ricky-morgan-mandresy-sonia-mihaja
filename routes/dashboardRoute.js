const express = require("express");
const router = express.Router();
const {
  getAveragePerCourse,
  getGradeDistribution,
  GetDashoardScolarite,
  getDashboardAdminData
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
router.get("/dashboardScolarite", requireRole(["SCOLARITE"]), GetDashoardScolarite)
router.get("/dashboardAdmin", requireRole(["ADMIN"]), getDashboardAdminData);

module.exports = router;