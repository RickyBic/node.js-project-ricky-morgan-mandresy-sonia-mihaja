const { Course, Grade } = require("../models/schemas");

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
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Supprimer les notes liées à ce cours
    await Grade.deleteMany({ course: course._id });

    res.json({ message: "Course and related grades deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while deleting course" });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
