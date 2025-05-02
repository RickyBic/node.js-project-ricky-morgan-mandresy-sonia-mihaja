const express = require("express");
const router = express.Router();
const {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
} = require("../controllers/courseController");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const { get } = require("mongoose");

router.use(authMiddleware);

router.get("/", requireRole(["ADMIN", "SCOLARITE"]), getCourses);
router.get("/:id", requireRole(["ADMIN", "SCOLARITE"]), getCourseById);
router.post("/", requireRole(["ADMIN", "SCOLARITE"]), createCourse);
router.put("/:id", requireRole(["ADMIN", "SCOLARITE"]), updateCourse);
router.delete("/:id", requireRole(["ADMIN", "SCOLARITE"]), deleteCourse);

module.exports = router;
