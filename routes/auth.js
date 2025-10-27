const express = require('express');
const passport = require('passport');
const router = express.Router();

// Ruta de login con Discord
router.get('/login', passport.authenticate('discord'));

// Callback de Discord OAuth
router.get('/callback', 
    passport.authenticate('discord', {
        failureRedirect: '/login?error=unauthorized'
    }),
    (req, res) => {
        res.redirect('/dashboard');
    }
);

// Ruta de logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al cerrar sesión' });
        }
        res.redirect('/');
    });
});

// Verificar si el usuario está autenticado
router.get('/check', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            authenticated: true,
            user: {
                id: req.user.id,
                discord_id: req.user.discord_id,
                username: req.user.username,
                discriminator: req.user.discriminator,
                avatar: req.user.avatar
            }
        });
    } else {
        res.json({ authenticated: false });
    }
});

module.exports = router;
