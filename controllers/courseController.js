const { Course } = require("../models/schemas");

const getCourses = async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
};

const getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });
  res.json(course);
};

const createCourse = async (req, res) => {
  const { name, code } = req.body;

  const course = new Course({
    name,
    code,
  });

  await course.save();
  res.status(201).json({ message: "Course created successfully" });
};

const updateCourse = async (req, res) => {
  const { name, code } = req.body;
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  course.name = name;
    course.code = code;

  await course.save();
  res.json({ message: "Course updated successfully" });
};

const deleteCourse = async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });
  res.json({ message: "Course deleted successfully" });
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
