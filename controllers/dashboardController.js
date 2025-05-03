const { Grade } = require("../models/schemas");
const mongoose = require("mongoose");

const getAveragePerCourse = async (req, res) => {
  try {
    const studentId = new mongoose.Types.ObjectId(String(req.params.id));
    const result = await Grade.aggregate([
      { $match: { student: studentId } },
      {
        $group: {
          _id: "$course",
          averageGrade: { $avg: "$grade" },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      {
        $project: {
          courseName: "$course.name",
          averageGrade: 1,
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    console.error("Erreur dans getAveragePerCourse:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const getGradeDistribution = async (req, res) => {
  try {
    const studentId = req.params.id;

    const grades = await Grade.find({ student: studentId }).select("grade");

    const distribution = {
      "0-9": 0,
      "10-11": 0,
      "12-13": 0,
      "14-15": 0,
      "16-20": 0,
    };

    grades.forEach(({ grade }) => {
      if (grade < 10) distribution["0-9"]++;
      else if (grade < 12) distribution["10-11"]++;
      else if (grade < 14) distribution["12-13"]++;
      else if (grade < 16) distribution["14-15"]++;
      else distribution["16-20"]++;
    });

    res.json(distribution);
  } catch (error) {
    console.error("Erreur distribution des notes:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  getAveragePerCourse,
  getGradeDistribution,
};
