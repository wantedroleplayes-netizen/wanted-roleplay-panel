const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('./config/passport');
const { startBot } = require('./config/discord-bot');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const db = require('./config/database');
const ChatMessage = require('./models/ChatMessage');
require('dotenv').config();

// Crear aplicación Express
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Configuración de sesiones
const sessionStore = new MySQLStore({
    createDatabaseTable: false,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
}, db);

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'wanted-roleplay-secret-key-change-this',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
    }
});

// Middlewares
app.use(helmet({
    contentSecurityPolicy: false // Deshabilitado para desarrollo
}));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite de 100 requests por IP
});
app.use('/api/', limiter);

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));

// Socket.IO para chat en tiempo real
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

io.on('connection', (socket) => {
    const session = socket.request.session;
    
    if (!session.passport || !session.passport.user) {
        socket.disconnect();
        return;
    }
    
    console.log('Usuario conectado al chat:', session.passport.user);
    
    // Enviar mensajes recientes al conectar
    ChatMessage.getRecent(50).then(messages => {
        socket.emit('chat:history', messages);
    });
    
    // Recibir nuevo mensaje
    socket.on('chat:message', async (data) => {
        try {
            const user = await require('./models/User').findByDiscordId(session.passport.user);
            
            if (!user) {
                socket.emit('chat:error', 'Usuario no autorizado');
                return;
            }
            
            const messageData = {
                user_id: user.id,
                username: user.username,
                message: data.message
            };
            
            const messageId = await ChatMessage.create(messageData);
            
            const messageWithId = {
                id: messageId,
                ...messageData,
                created_at: new Date()
            };
            
            // Enviar a todos los usuarios conectados
            io.emit('chat:newMessage', messageWithId);
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            socket.emit('chat:error', 'Error al enviar mensaje');
        }
    });
    
    // Usuario escribiendo
    socket.on('chat:typing', async () => {
        try {
            const user = await require('./models/User').findByDiscordId(session.passport.user);
            if (user) {
                socket.broadcast.emit('chat:userTyping', user.username);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
    
    socket.on('disconnect', () => {
        console.log('Usuario desconectado del chat');
    });
});

// Middleware de manejo de errores
app.use((req, res, next) => {
    res.status(404).render('404', { user: req.user || null });
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    // Si es una petición API, devolver JSON
    if (req.path.startsWith('/api/')) {
        return res.status(err.status || 500).json({
            error: err.message || 'Error interno del servidor',
            status: err.status || 500
        });
    }
    
    // Si es una petición web, renderizar página de error
    res.status(err.status || 500).render('500', {
        user: req.user || null,
        error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log('================================================');
    console.log('🎮 WANTED ROLEPLAY STAFF PANEL');
    console.log('================================================');
    console.log(`✅ Servidor iniciado en http://localhost:${PORT}`);
    console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log('================================================');
    
    // Iniciar bot de Discord
    startBot();
});

// Manejo de cierre
process.on('SIGINT', async () => {
    console.log('\n🔴 Cerrando servidor...');
    await db.end();
    process.exit(0);
});

module.exports = { app, io };
