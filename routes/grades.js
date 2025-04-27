let { Grade, Student, Course } = require('../model/schemas');

function getAll(req, res) {
    Grade.find()
        .populate('student')
        .populate('course')
        .then((grades) => {
            res.send(grades);
        })
        .catch((err) => {
            res.status(500).json({ message: "Error fetching grades", error: err.message });
        });
}

function create(req, res) {
    const { student, course, grade, date } = req.body;

    // Validation des champs requis
    if (!student || !course || grade === undefined || !date) {
        return res.status(400).json({ message: "Missing required fields: student, course, grade, date" });
    }

    let gradeDoc = new Grade({
        student,
        course,
        grade,
        date,
    });

    gradeDoc.save()
        .then((savedGrade) => {
            res.status(201).json({ message: `Grade saved with id ${savedGrade.id}!` });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ message: "Can't post grade", error: err.message });
        });
}

function update(req, res) {
    const id = req.params.id;
    const { student, course, grade, date } = req.body;

    // Validation des champs requis
    if (!student || !course || grade === undefined || !date) {
        return res.status(400).json({ message: "Missing required fields: student, course, grade, date" });
    }

    Grade.findByIdAndUpdate(id, {
        student,
        course,
        grade,
        date,
    }, { new: true }) // retourne l'objet mis à jour
        .then((updatedGrade) => {
            if (!updatedGrade) {
                return res.status(404).send({ message: 'Grade not found' });
            }
            res.json({ message: 'Grade updated successfully', data: updatedGrade });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send('Cannot update grade: ' + err.message);
        });
}

function remove(req, res) {
    const id = req.params.id;

    Grade.findByIdAndDelete(id)
        .then((deletedGrade) => {
            if (!deletedGrade) {
                return res.status(404).send({ message: 'Grade not found' });
            }
            res.json({ message: 'Grade deleted successfully' });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send('Cannot delete grade: ' + err.message);
        });
}

module.exports = { getAll, create, update, remove };
