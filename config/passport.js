const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const User = require('../models/User');
require('dotenv').config();

passport.serializeUser((user, done) => {
    done(null, user.discord_id);
});

passport.deserializeUser(async (discordId, done) => {
    try {
        const user = await User.findByDiscordId(discordId);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify', 'guilds']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Buscar usuario en la base de datos
        let user = await User.findByDiscordId(profile.id);
        
        if (!user) {
            // Usuario no existe o no tiene permisos
            return done(null, false, { message: 'No tienes permisos para acceder al panel de staff' });
        }
        
        // Actualizar información del usuario
        await User.update(profile.id, {
            username: profile.username,
            discriminator: profile.discriminator,
            avatar: profile.avatar,
            role_id: user.role_id
        });
        
        // Obtener usuario actualizado
        user = await User.findByDiscordId(profile.id);
        
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

module.exports = passport;
