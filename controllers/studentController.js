const { Student } = require("../models/schemas");

const getStudents = async (req, res) => {
  const students = await Student.find();
  res.json(students);
};

const getStudentById = async (req, res) => {
  const student = await Student.findById(user.studentId);
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json(student);
};

const createStudent = async (req, res) => {
  const { firstName, lastName, program } = req.body;

  const student = new Student({
    firstName,
    lastName,
    program,
  });

  await student.save();
  res.status(201).json({ message: "Student created successfully" });
};

const updateStudent = async (req, res) => {
  const { firstName, lastName, program } = req.body;
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });

  student.firstName = firstName;
  student.lastName = lastName;
  student.program = program;

  await student.save();
  res.json({ message: "Student updated successfully" });
};

const deleteStudent = async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json({ message: "Student deleted successfully" });
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
