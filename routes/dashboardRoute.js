const express = require("express");
const router = express.Router();
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

router.use(authMiddleware);

// Votre code est à mettre ici

module.exports = router;
