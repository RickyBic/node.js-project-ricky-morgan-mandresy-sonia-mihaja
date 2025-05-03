const express = require("express");
const router = express.Router();
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const { GetDashoardScolarite } = require("../controllers/dashboardController");

router.use(authMiddleware);

router.get("/dashboardScolarite", requireRole(["SCOLARITE"]), GetDashoardScolarite)

module.exports = router;
