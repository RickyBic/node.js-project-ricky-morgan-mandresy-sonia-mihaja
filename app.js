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
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');

// Connexion MongoDB
mongoose.Promise = global.Promise;
const options = {};

mongoose.connect(process.env.MONGO_URI, options)
    .then(() => console.log("Connexion à la base OK"))
    .catch(err => console.error("Erreur de connexion:", err));

// Middleware CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// Middleware Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route Auth
app.use('/auth', authRoute);

// Routes API
app.use(`${prefix}/users`, userRoute);

// Démarrage serveur
app.listen(port, '0.0.0.0', () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});

module.exports = app;
