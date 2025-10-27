const express = require('express');
const router = express.Router();

// Middleware para verificar autenticación
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

// Página de inicio / login
router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    res.render('login');
});

router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    res.render('login', { error: req.query.error });
});

// Dashboard
router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', { user: req.user });
});

// Panel de baneos
router.get('/bans', isAuthenticated, (req, res) => {
    res.render('bans', { user: req.user });
});

// Panel de jail
router.get('/jails', isAuthenticated, (req, res) => {
    res.render('jails', { user: req.user });
});

// Panel de hackers
router.get('/hackers', isAuthenticated, (req, res) => {
    res.render('hackers', { user: req.user });
});

// Panel de devoluciones
router.get('/refunds', isAuthenticated, (req, res) => {
    res.render('refunds', { user: req.user });
});

// Panel de donaciones
router.get('/donations', isAuthenticated, (req, res) => {
    res.render('donations', { user: req.user });
});

// Chat interno
router.get('/chat', isAuthenticated, (req, res) => {
    res.render('chat', { user: req.user });
});

// Logs de actividad
router.get('/activity', isAuthenticated, (req, res) => {
    res.render('activity', { user: req.user });
});

// Blacklist
router.get('/blacklist', isAuthenticated, (req, res) => {
    res.render('blacklist', { user: req.user });
});

module.exports = router;
