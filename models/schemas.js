const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    googleEmail: { type: String, default: null },
    role: {
        type: String,
        enum: ['ADMIN', 'SCOLARITE', 'STUDENT'],
        required: true
    },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null },
});
const User = mongoose.model('User', UserSchema);

const StudentSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    program: {
        type: String,
        required: true,
        enum: ['Bachelor', 'Master', 'PhD']
    },
});
const Student = mongoose.model('Student', StudentSchema);

const CourseSchema = new Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
});
const Course = mongoose.model('Course', CourseSchema);

const GradeSchema = new Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    grade: { type: Number, required: true },
    date: { type: Date, required: true },
});
const Grade = mongoose.model('Grade', GradeSchema);

module.exports = {
    User,
    Student,
    Course,
    Grade
};
