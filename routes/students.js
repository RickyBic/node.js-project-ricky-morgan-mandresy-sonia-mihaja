const { Student } = require("../model/schemas");

// Récupérer tous les étudiants
function getAll(req, res) {
  Student.find()
    .then((students) => res.send(students))
    .catch((err) => res.status(500).json({ message: "Error fetching students", error: err.message }));
}

// Créer un nouvel étudiant
function create(req, res) {
  const { firstName, lastName, program } = req.body;

  if (!firstName || !lastName || !program) {
    return res.status(400).json({ message: "firstName, lastName and program are required." });
  }

  const student = new Student({ firstName, lastName, program });

  student.save()
    .then((student) => {
      res.status(201).json({ message: `Student saved with id ${student.id}!` });
    })
    .catch((err) => {
      res.status(500).json({ message: "Can't post student", error: err.message });
    });
}

// Supprimer un étudiant par ID
function remove(req, res) {
  const id = req.params.id;

  Student.findByIdAndDelete(id)
    .then((student) => {
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json({ message: `Student with id ${id} deleted.` });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error deleting student", error: err.message });
    });
}

// Mettre à jour un étudiant
function update(req, res) {
  const studentId = req.body._id;
  if (!studentId) {
    return res.status(400).json({ message: "Student ID is required" });
  }

  Student.findById(studentId)
    .then((student) => {
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      const { firstName, lastName, program } = req.body;

      if (firstName) student.firstName = firstName;
      if (lastName) student.lastName = lastName;
      if (program) student.program = program;

      student.save()
        .then((updatedStudent) => {
          res.status(200).json({ message: `Student updated with id ${updatedStudent.id}` });
        })
        .catch((err) => {
          res.status(500).json({ message: "Unable to update student", error: err.message });
        });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error finding student", error: err.message });
    });
}

module.exports = { getAll, create, remove, update };
