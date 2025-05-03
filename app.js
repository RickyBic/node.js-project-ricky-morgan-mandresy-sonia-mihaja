const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Config
dotenv.config();
const app = express();
const port = process.env.PORT || 8010;
const prefix = '/api';

// Routes
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const studentRoute = require('./routes/studentRoute');
const courseRoute = require('./routes/courseRoute');
const gradeRoute = require('./routes/gradeRoute');

// Connexion MongoDB
mongoose.Promise = global.Promise;
const options = {};

mongoose.connect(process.env.MONGO_URI, options)
    .then(() => console.log("Connexion à la base OK"))
    .catch(err => console.error("Erreur de connexion:", err));

// Middleware CORS
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route Auth
app.use('/auth', authRoute);

// Routes API
app.use(`${prefix}/users`, userRoute);
app.use(`${prefix}/students`, studentRoute);
app.use(`${prefix}/courses`, courseRoute);
app.use(`${prefix}/grades`, gradeRoute);

// Démarrage serveur
app.listen(port, '0.0.0.0', () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});

module.exports = app;
