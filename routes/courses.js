let { Course } = require('../model/schemas');

function getAll(req, res) {
    Course.find()
        .then((courses) => {
            res.send(courses);
        })
        .catch((err) => {
            res.status(500).json({ message: "Error fetching courses", error: err.message });
        });
}

function create(req, res) {
    const { name, code } = req.body;

    // Validation des données
    if (!name || !code) {
        return res.status(400).json({ message: "Both 'name' and 'code' are required" });
    }

    const course = new Course({ name, code });

    course.save()
        .then((course) => {
            res.status(201).json({ message: `Course saved with id ${course.id}!` });
        })
        .catch((err) => {
            res.status(500).json({ message: "Can't post course", error: err.message });
        });
}

function remove(req, res) {
    const id = req.params.id;

    Course.findByIdAndDelete(id)
        .then((course) => {
            if (!course) {
                console.log("Course not found " + id);
                return res.status(404).json({ message: "Course not found" });
            }
            res.json({ message: `Course with id ${id} deleted.` });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ message: "Error deleting course", error: err.message });
        });
}

function update(req, res) {
    const courseId = req.body._id;
    if (!courseId) {
        return res.status(400).json({ message: 'Course ID is required' });
    }

    Course.findById(courseId)
        .then((course) => {
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            const { name, code } = req.body;

            if (name) course.name = name;
            if (code) course.code = code;

            course.save()
                .then((updatedCourse) => {
                    res.status(200).json({ message: `Course updated with id ${updatedCourse.id}` });
                })
                .catch((err) => {
                    res.status(500).json({ message: 'Unable to update course', error: err.message });
                });
        })
        .catch((err) => {
            res.status(500).json({ message: 'Error finding course', error: err.message });
        });
}

module.exports = { getAll, create, remove, update };
