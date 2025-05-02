const { Grade } = require("../models/schemas");

// Obtenir toutes les notes
const getGrades = async (req, res) => {
  try {
    const grades = await Grade.find().populate('student').populate('course');
    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir une note par ID
const getGradeById = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id).populate('student').populate('course');
    if (!grade) return res.status(404).json({ message: "Grade not found" });
    res.json(grade);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Créer une nouvelle note
const createGrade = async (req, res) => {
  const { student, course, grade, date } = req.body;

  const newGrade = new Grade({
    student,
    course,
    grade,
    date,
  });

  try {
    await newGrade.save();
    res.status(201).json({ message: "Grade created successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Mettre à jour une note
const updateGrade = async (req, res) => {
  const { student, course, grade, date } = req.body;

  try {
    const existingGrade = await Grade.findById(req.params.id);
    if (!existingGrade) return res.status(404).json({ message: "Grade not found" });

    existingGrade.student = student;
    existingGrade.course = course;
    existingGrade.grade = grade;
    existingGrade.date = date;

    await existingGrade.save();
    res.json({ message: "Grade updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer une note
const deleteGrade = async (req, res) => {
  try {
    const grade = await Grade.findByIdAndDelete(req.params.id);
    if (!grade) return res.status(404).json({ message: "Grade not found" });
    res.json({ message: "Grade deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getGrades,
  getGradeById,
  createGrade,
  updateGrade,
  deleteGrade,
};
