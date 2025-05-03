const { Course, Student, User, Grade } =require ("../models/schemas");

const getDashboardAdminData = async (req, res) => {
  try {
    const courses = await Course.countDocuments();
    const students = await Student.countDocuments();
    const users = await User.countDocuments();
    const grades = await Grade.countDocuments();

    // Compter les utilisateurs par rôle
    const userByRoleRaw = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);

    const userByRole = {};
    userByRoleRaw.forEach(item => {
      userByRole[item._id] = item.count;
    });

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
      courses,
      students,
      users,
      grades,
      userByRole,
      avgGradesByCourse
    };

    res.json(dashboardData);
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Erreur lors du chargement du dashboard" });
  }
};

module.exports={getDashboardAdminData}
