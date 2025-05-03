const { Course, Grade, Student } = require("../models/schemas")

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
    GetDashoardScolarite
};