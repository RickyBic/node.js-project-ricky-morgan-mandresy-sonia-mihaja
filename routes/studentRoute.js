const express = require("express");
const router = express.Router();
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentGrades,
} = require("../controllers/studentController");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", requireRole(["ADMIN", "SCOLARITE"]), getStudents);
router.get(
  "/:id",
  requireRole(["ADMIN", "SCOLARITE", "STUDENT"]),
  getStudentById
);
router.post("/", requireRole(["ADMIN", "SCOLARITE"]), createStudent);
router.put("/:id", requireRole(["ADMIN", "SCOLARITE"]), updateStudent);
router.delete("/:id", requireRole(["ADMIN", "SCOLARITE"]), deleteStudent);
router.get(
  "/:id/grades",
  requireRole(["ADMIN", "SCOLARITE", "STUDENT"]),
  getStudentGrades
);

module.exports = router;
