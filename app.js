const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Config
dotenv.config();
const app = express();
const port = process.env.PORT || 8010;
const prefix = '/api';

// Routes
const authRoute = require('./routes/auth');
const course = require('./routes/courses');
const dashboard = require('./routes/dashboard');
const grade = require('./routes/grades');
const student = require('./routes/students');
const user = require('./routes/users');

// Connexion MongoDB
mongoose.Promise = global.Promise;
const options = {};

mongoose.connect(process.env.MONGO_URI, options)
    .then(() => console.log("Connexion à la base OK"))
    .catch(err => console.error("Erreur de connexion:", err));

// Middleware CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// Middleware Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route Auth (Google OAuth)
app.use('/auth', authRoute);

// Routes API
app.route(`${prefix}/students`)
    .get(student.getAll)
    .post(student.create);

app.route(`${prefix}/student/:id`)
    .delete(student.remove);

app.route(`${prefix}/student`)
    .put(student.update);

app.route(`${prefix}/courses`)
    .get(course.getAll)
    .post(course.create);

app.route(`${prefix}/course/:id`)
    .delete(course.remove);

app.route(`${prefix}/course`)
    .put(course.update);

app.route(`${prefix}/grades`)
    .get(grade.getAll)
    .post(grade.create);

app.route(`${prefix}/grades/:id`)
    .put(grade.update)
    .delete(grade.remove);

// Démarrage serveur
app.listen(port, '0.0.0.0', () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});

module.exports = app;
