const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');
let { User } = require('../models/schemas');

const redirectUrl = `${process.env.BACKEND_URL}/auth/callback`;

// Génère un token JWT avec les infos essentielles
function generateJwtToken(user, extra = {}) {
    const payload = {
        id: user._id,
        username: user.username,
        googleEmail: user.googleEmail,
        role: user.role,
        studentId: user.studentId,
        ...extra,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
    return { token, payload };
}

// Redirige le frontend avec un message d'erreur encodé dans authError
function redirectWithError(res, message) {
    const encoded = encodeURIComponent(message);
    res.redirect(`${process.env.FRONTEND_URL}/?authError=${encoded}`);
}

// Récupère les infos utilisateur depuis Google
async function getUserData(access_token) {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user info from Google');
    }
    return await response.json();
}

// Authentification classique CoreUI (username/password)
router.post('/login-coreui', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user || !user.password) {
            return res.status(401).json({
                error: 'Invalid credentials. Please check your username or password and try again.'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Invalid credentials. The provided password is incorrect.'
            });
        }

        const { token, payload } = generateJwtToken(user);
        return res.json({ token, user: payload });

    } catch (err) {
        console.error('Error during CoreUI login:', err);
        return res.status(500).json({
            error: 'An internal server error occurred while processing your login request. Please try again later.'
        });
    }
});

// Démarre le flow OAuth Google
router.post('/login', (req, res) => {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
    res.header('Referrer-Policy', 'no-referrer-when-downgrade');

    const oAuth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        redirectUrl
    );

    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
        prompt: 'consent',
    });

    res.json({ url: authorizeUrl });
});

// Callback après authentification Google
router.get('/callback', async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return redirectWithError(res, 'Authorization code missing from Google callback.');
    }

    try {
        const oAuth2Client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            redirectUrl
        );

        const result = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(result.tokens);

        const googleUser = await getUserData(result.tokens.access_token);
        const existingUser = await User.findOne({ googleEmail: googleUser.email });

        if (!existingUser) {
            return redirectWithError(res, 'No account is linked to this Google email. Please contact an administrator.');
        }

        const { token, payload } = generateJwtToken(existingUser, { picture: googleUser.picture });

        const frontendRedirect = `${process.env.FRONTEND_URL}/?token=${token}&user=${encodeURIComponent(JSON.stringify(payload))}`;
        return res.redirect(frontendRedirect);

    } catch (err) {
        console.error('Error signing in with Google:', err);
        return redirectWithError(res, 'Authentication failed. Please try again later.');
    }
});

module.exports = router;
