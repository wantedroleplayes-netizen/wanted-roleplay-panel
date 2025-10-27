// Middleware de autenticación

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    
    // Si es una petición API, devolver error JSON
    if (req.path.startsWith('/api/')) {
        return res.status(401).json({ error: 'No autorizado. Debes iniciar sesión.' });
    }
    
    // Si es una página, redirigir al login
    res.redirect('/login?error=unauthorized');
}

function isNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/dashboard');
}

module.exports = {
    isAuthenticated,
    isNotAuthenticated
};
