const express = require("express");
const router = express.Router();
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const {getDashboardAdminData} = require('../controllers/dashboardController');

router.use(authMiddleware);

router.get("/dashboardAdmin", requireRole(["ADMIN"]), getDashboardAdminData);


module.exports = router;
