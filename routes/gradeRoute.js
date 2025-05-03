const express = require("express");
const router = express.Router();
const {
    getGrades,
    getGradeById,
    createGrade,
    updateGrade,
    deleteGrade,
} = require("../controllers/gradeController");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const { get } = require("mongoose");

router.use(authMiddleware);

router.get("/", requireRole(["ADMIN", "SCOLARITE"]), getGrades);
router.get("/:id", requireRole(["ADMIN", "SCOLARITE"]), getGradeById);
router.post("/", requireRole(["ADMIN", "SCOLARITE"]), createGrade);
router.put("/:id", requireRole(["ADMIN", "SCOLARITE"]), updateGrade);
router.delete("/:id", requireRole(["ADMIN", "SCOLARITE"]), deleteGrade);


module.exports = router;
