const { Course, Grade, Student } = require("../models/schemas")
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

const GetDashoardScolarite = async(req, res) => {
        try {
        const studentCount = await Student.countDocuments();
        const courseCount = await Course.countDocuments();
        const emptyCoursesCount = await Course.find({ students: { $size: 0 } }).countDocuments();

        const countStudentByProgram = await Student.aggregate([
        {
            $group: {
            _id: "$program",       
            count: { $sum: 1 }      
            }
        }
        ]);

        const avgGradesByCourse = await Grade.aggregate([
        {
          $group: {
            _id: "$course", // ID du cours
            averageGrade: { $avg: "$grade" } // Moyenne des notes
          }
        },
        {
          $lookup: {
            from: "courses", // nom de la collection (mongoose transforme "Course" en "courses")
            localField: "_id",
            foreignField: "_id",
            as: "course"
          }
        },
        { $unwind: "$course" }, // pour aplatir le tableau retourné par $lookup
        {
          $project: {
            _id: 0,
            courseId: "$course._id",
            courseName: "$course.name",
            courseCode: "$course.code",
            averageGrade: { $round: ["$averageGrade", 2] }
          }
        },
      ]);

        const dashboardData = {
            students: studentCount,
            courses: courseCount,
            emptyCourses: emptyCoursesCount,
            studentByProgram : countStudentByProgram,
            avgGradesByCourse : avgGradesByCourse
        };
        res.json(dashboardData);
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
  getAveragePerCourse,
  getGradeDistribution,
  GetDashoardScolarite
};