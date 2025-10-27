const express = require('express');
const router = express.Router();
const axios = require('axios');
const Ban = require('../models/Ban');
const Jail = require('../models/Jail');
const Hacker = require('../models/Hacker');
const Refund = require('../models/Refund');
const Donation = require('../models/Donation');
const ChatMessage = require('../models/ChatMessage');
const ActivityLog = require('../models/ActivityLog');
const Blacklist = require('../models/Blacklist');
const Whitelist = require('../models/Whitelist');
const UserNote = require('../models/UserNote');
const { sendWebhook } = require('../config/webhook');
const { body, validationResult } = require('express-validator');
const { client: discordClient } = require('../config/discord-bot');

// Configuración de Analystic API
const ANALYSTIC_API_KEY = process.env.ANALYSTIC_API_KEY || 'wantedrp2025';
const ANALYSTIC_API_URL = process.env.ANALYSTIC_API_URL || 'https://api.analystic.de';

// Función para consultar Analystic API
async function checkAnalysticAPI(userId) {
    const results = {
        isCheatCustomer: false,
        cheatSoftware: [],
        userData: null,
        messages: null,
        identifiers: null,
        error: null
    };

    try {
        // 1. Verificar si es cliente de cheats
        try {
            const cheatResponse = await axios.get(`${ANALYSTIC_API_URL}/cheat_customer/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${ANALYSTIC_API_KEY}`
                },
                timeout: 5000
            });

            if (cheatResponse.data && cheatResponse.data.found && cheatResponse.data.found.length > 0) {
                results.isCheatCustomer = true;
                results.cheatSoftware = cheatResponse.data.found;
            }
        } catch (error) {
            // Si da 404, no es cliente de cheats (esto es bueno)
            if (error.response && error.response.status !== 404) {
                console.log('Error al verificar cheat customer:', error.message);
            }
        }

        // 2. Obtener datos del usuario
        try {
            const userResponse = await axios.get(`${ANALYSTIC_API_URL}/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${ANALYSTIC_API_KEY}`
                },
                timeout: 5000
            });

            if (userResponse.data && userResponse.data.username) {
                results.userData = userResponse.data;
            }
        } catch (error) {
            if (error.response && error.response.status !== 404) {
                console.log('Error al obtener datos de usuario:', error.message);
            }
        }

        // 3. Obtener mensajes (opcional - puede tener mucha data)
        try {
            const messagesResponse = await axios.get(`${ANALYSTIC_API_URL}/messages/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${ANALYSTIC_API_KEY}`
                },
                timeout: 5000
            });

            if (messagesResponse.data) {
                results.messages = messagesResponse.data;
            }
        } catch (error) {
            // Los mensajes son opcionales
        }

        // 4. Obtener identificadores
        try {
            const identResponse = await axios.get(`${ANALYSTIC_API_URL}/identifier/discord:${userId}`, {
                headers: {
                    'Authorization': `Bearer ${ANALYSTIC_API_KEY}`
                },
                timeout: 5000
            });

            if (identResponse.data) {
                results.identifiers = identResponse.data;
            }
        } catch (error) {
            // Los identificadores son opcionales
        }

    } catch (error) {
        results.error = error.message;
    }

    return results;
}

// Middleware para verificar autenticación
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'No autorizado' });
};

// ============ BANEOS ============

// Obtener todos los baneos
router.get('/bans', isAuthenticated, async (req, res) => {
    try {
        const { search, active } = req.query;
        let bans;
        
        if (search) {
            bans = await Ban.searchByPlayer(search);
        } else if (active === 'true') {
            bans = await Ban.getActive();
        } else {
            bans = await Ban.getAll();
        }
        
        res.json(bans);
    } catch (error) {
        console.error('Error al obtener baneos:', error);
        res.status(500).json({ error: 'Error al obtener baneos' });
    }
});

// Crear nuevo baneo
router.post('/bans', isAuthenticated, [
    body('player_name').notEmpty().trim(),
    body('reason').notEmpty().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const banData = {
            ...req.body,
            banned_by: req.user.id,
            banned_by_name: req.user.username
        };
        
        const banId = await Ban.create(banData);
        
        // Enviar a webhook de Discord
        await sendWebhook('ban', banData);
        
        // Registrar actividad
        await ActivityLog.create({
            user_id: req.user.id,
            username: req.user.username,
            action: 'CREATE_BAN',
            table_name: 'bans',
            record_id: banId,
            description: `Baneó a ${banData.player_name}`,
            ip_address: req.ip
        });
        
        res.json({ success: true, id: banId });
    } catch (error) {
        console.error('Error al crear baneo:', error);
        res.status(500).json({ error: 'Error al crear baneo' });
    }
});

// Actualizar baneo
router.put('/bans/:id', isAuthenticated, async (req, res) => {
    try {
        await Ban.update(req.params.id, req.body);
        
        await ActivityLog.create({
            user_id: req.user.id,
            username: req.user.username,
            action: 'UPDATE_BAN',
            table_name: 'bans',
            record_id: req.params.id,
            description: `Actualizó baneo #${req.params.id}`,
            ip_address: req.ip
        });
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error al actualizar baneo:', error);
        res.status(500).json({ error: 'Error al actualizar baneo' });
    }
});

// Eliminar baneo
router.delete('/bans/:id', isAuthenticated, async (req, res) => {
    try {
        await Ban.delete(req.params.id);
        
        await ActivityLog.create({
            user_id: req.user.id,
            username: req.user.username,
            action: 'DELETE_BAN',
            table_name: 'bans',
            record_id: req.params.id,
            description: `Eliminó baneo #${req.params.id}`,
            ip_address: req.ip
        });
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error al eliminar baneo:', error);
        res.status(500).json({ error: 'Error al eliminar baneo' });
    }
});

// ============ JAIL ============

// Obtener todos los jails
router.get('/jails', isAuthenticated, async (req, res) => {
    try {
        const { search, active } = req.query;
        let jails;
        
        if (search) {
            jails = await Jail.searchByPlayer(search);
        } else if (active === 'true') {
            jails = await Jail.getActive();
        } else {
            jails = await Jail.getAll();
        }
        
        res.json(jails);
    } catch (error) {
        console.error('Error al obtener jails:', error);
        res.status(500).json({ error: 'Error al obtener jails' });
    }
});

// Crear nuevo jail
router.post('/jails', isAuthenticated, [
    body('player_name').notEmpty().trim(),
    body('reason').notEmpty().trim(),
    body('duration').notEmpty().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const jailData = {
            ...req.body,
            jailed_by: req.user.id,
            jailed_by_name: req.user.username
        };
        
        const jailId = await Jail.create(jailData);
        
        await sendWebhook('jail', jailData);
        
        await ActivityLog.create({
            user_id: req.user.id,
            username: req.user.username,
            action: 'CREATE_JAIL',
            table_name: 'jail',
            record_id: jailId,
            description: `Encarceló a ${jailData.player_name}`,
            ip_address: req.ip
        });
        
        res.json({ success: true, id: jailId });
    } catch (error) {
        console.error('Error al crear jail:', error);
        res.status(500).json({ error: 'Error al crear jail' });
    }
});

// Liberar de jail
router.post('/jails/:id/release', isAuthenticated, async (req, res) => {
    try {
        await Jail.release(req.params.id);
        
        await ActivityLog.create({
            user_id: req.user.id,
            username: req.user.username,
            action: 'RELEASE_JAIL',
            table_name: 'jail',
            record_id: req.params.id,
            description: `Liberó del jail #${req.params.id}`,
            ip_address: req.ip
        });
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error al liberar de jail:', error);
        res.status(500).json({ error: 'Error al liberar de jail' });
    }
});

// Actualizar jail
router.put('/jails/:id', isAuthenticated, async (req, res) => {
    try {
        await Jail.update(req.params.id, req.body);
        
        await ActivityLog.create({
            user_id: req.user.id,
            username: req.user.username,
            action: 'UPDATE_JAIL',
            table_name: 'jail',
            record_id: req.params.id,
            description: `Actualizó jail #${req.params.id}`,
            ip_address: req.ip
        });
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error al actualizar jail:', error);
        res.status(500).json({ error: 'Error al actualizar jail' });
    }
});

// Eliminar jail
router.delete('/jails/:id', isAuthenticated, async (req, res) => {
    try {
        await Jail.delete(req.params.id);
        
        await ActivityLog.create({
            user_id: req.user.id,
            username: req.user.username,
            action: 'DELETE_JAIL',
            table_name: 'jail',
            record_id: req.params.id,
            description: `Eliminó jail #${req.params.id}`,
            ip_address: req.ip
        });
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error al eliminar jail:', error);
        res.status(500).json({ error: 'Error al eliminar jail' });
    }
});

// ============ HACKERS ============

// Obtener todos los hackers
router.get('/hackers', isAuthenticated, async (req, res) => {
    try {
        const { search, unresolved } = req.query;
        let hackers;
        
        if (search) {
            hackers = await Hacker.searchByPlayer(search);
        } else if (unresolved === 'true') {
            hackers = await Hacker.getUnresolved();
        } else {
            hackers = await Hacker.getAll();
        }
        
        res.json(hackers);
    } catch (error) {
        console.error('Error al obtener hackers:', error);
        res.status(500).json({ error: 'Error al obtener hackers' });
    }
});

// Crear nuevo reporte de hacker
router.post('/hackers', isAuthenticated, [
    body('player_name').notEmpty().trim(),
    body('hack_type').notEmpty().trim(),
    body('description').notEmpty().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const hackerData = {
            ...req.body,
            reported_by: req.user.id,
            reported_by_name: req.user.username
        };
        
        const hackerId = await Hacker.create(hackerData);
        
        await sendWebhook('hacker', hackerData);
        
        await ActivityLog.create({
            user_id: req.user.id,
            username: req.user.username,
            action: 'CREATE_HACKER',
            table_name: 'hackers',
            record_id: hackerId,
            description: `Reportó hacker: ${hackerData.player_name}`,
            ip_address: req.ip
        });
        
        res.json({ success: true, id: hackerId });
    } catch (error) {
        console.error('Error al crear reporte de hacker:', error);
        res.status(500).json({ error: 'Error al crear reporte de hacker' });
    }
});

// Resolver reporte de hacker
router.post('/hackers/:id/resolve', isAuthenticated, async (req, res) => {
    try {
        const { action_taken } = req.body;
        await Hacker.resolve(req.params.id, action_taken);
        
        await ActivityLog.create({
            user_id: req.user.id,
            username: req.user.username,
            action: 'RESOLVE_HACKER',
            table_name: 'hackers',
            record_id: req.params.id,
            description: `Resolvió reporte de hacker #${req.params.id}`,
            ip_address: req.ip
        });
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error al resolver reporte:', error);
        res.status(500).json({ error: 'Error al resolver reporte' });
    }
});

// Actualizar hacker
router.put('/hackers/:id', isAuthenticated, async (req, res) => {
    try {
        await Hacker.update(req.params.id, req.body);
        
        await ActivityLog.create({
            user_id: req.user.id,
            username: req.user.username,
            action: 'UPDATE_HACKER',
            table_name: 'hackers',
            record_id: req.params.id,
            description: `Actualizó reporte de hacker #${req.params.id}`,
            ip_address: req.ip
        });
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error al actualizar hacker:', error);
        res.status(500).json({ error: 'Error al actualizar hacker' });
    }
});

// Eliminar hacker
router.delete('/hackers/:id', isAuthenticated, async (req, res) => {
    try {
        await Hacker.delete(req.params.id);
        
        await ActivityLog.create({
            user_id: req.user.id,
            username: req.user.username,
            action: 'DELETE_HACKER',
            table_name: 'hackers',
            record_id: req.params.id,
            description: `Eliminó reporte de hacker #${req.params.id}`,
            ip_address: req.ip
        });
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error al eliminar hacker:', error);
        res.status(500).json({ error: 'Error al eliminar hacker' });
    }
});

// ============ DEVOLUCIONES ============

// Obtener todas las devoluciones
router.get('/refunds', isAuthenticated, async (req, res) => {
    try {
        const { search, status } = req.query;
        let refunds;
        
        if (search) {
            refunds = await Refund.searchByPlayer(search);
        } else if (status) {
            refunds = await Refund.getByStatus(status);
        } else {
            refunds = await Refund.getAll();
        }
        
        res.json(refunds);
    } catch (error) {
        console.error('Error al obtener devoluciones:', error);
        res.status(500).json({ error: 'Error al obtener devoluciones' });
    }
});

// Crear nueva devolución
router.post('/refunds', isAuthenticated, [
    body('player_name').notEmpty().trim(),
    body('item_description').notEmpty().trim(),
    body('reason').notEmpty().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const refundData = {
            ...req.body,
            processed_by: req.user.id,
            processed_by_name: req.user.username
        };
        
        const refundId = await Refund.create(refundData);
        
        await sendWebhook('refund', refundData);
        
        await ActivityLog.create({
            user_id: req.user.id,
            username: req.user.username,
            action: 'CREATE_REFUND',
            table_name: 'refunds',
            record_id: refundId,
            description: `Registró devolución para ${refundData.player_name}`,
            ip_address: req.ip
        });
        
        res.json({ success: true, id: refundId });
    } catch (error) {
        console.error('Error al crear devolución:', error);
        res.status(500).json({ error: 'Error al crear devolución' });
    }
});

// Actualizar estado de devolución
router.patch('/refunds/:id/status', isAuthenticated, async (req, res) => {
    try {
        const { status } = req.body;
        await Refund.updateStatus(req.params.id, status);
        
        await ActivityLog.create({
            user_id: req.user.id,
            username: req.user.username,
            action: 'UPDATE_REFUND_STATUS',
            table_name: 'refunds',
            record_id: req.params.id,
            description: `Cambió estado de devolución #${req.params.id} a ${status}`,
            ip_address: req.ip
        });
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({ error: 'Error al actualizar estado' });
    }
});

// Actualizar devolución
router.put('/refunds/:id', isAuthenticated, async (req, res) => {
    try {
        await Refund.update(req.params.id, req.body);
        
        await ActivityLog.create({
            user_id: req.user.id,
            username: req.user.username,
            action: 'UPDATE_REFUND',
            table_name: 'refunds',
            record_id: req.params.id,
            description: `Actualizó devolución #${req.params.id}`,
            ip_address: req.ip
        });
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error al actualizar devolución:', error);
        res.status(500).json({ error: 'Error al actualizar devolución' });
    }
});

// Eliminar devolución
router.delete('/refunds/:id', isAuthenticated, async (req, res) => {
    try {
        await Refund.delete(req.params.id);
        
        await ActivityLog.create({
            user_id: req.user.id,
            username: req.user.username,
            action: 'DELETE_REFUND',
            table_name: 'refunds',
            record_id: req.params.id,
            description: `Eliminó devolución #${req.params.id}`,
            ip_address: req.ip
        });
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error al eliminar devolución:', error);
        res.status(500).json({ error: 'Error al eliminar devolución' });
    }
});

// ============ DONACIONES ============

// Obtener todas las donaciones
router.get('/donations', isAuthenticated, async (req, res) => {
    try {
        const { search, status } = req.query;
        let donations;
        
        if (search) {
            donations = await Donation.searchByPlayer(search);
        } else if (status) {
            donations = await Donation.getByStatus(status);
        } else {
            donations = await Donation.getAll();
        }
        
        res.json(donations);
    } catch (error) {
        console.error('Error al obtener donaciones:', error);
        res.status(500).json({ error: 'Error al obtener donaciones' });
    }
});

// Crear nueva donación
router.post('/donations', isAuthenticated, [
    body('player_name').notEmpty().trim(),
    body('amount').isNumeric()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const donationData = {
            ...req.body,
            recorded_by: req.user.id,
            recorded_by_name: req.user.username
        };
        
        const donationId = await Donation.create(donationData);
        
        await sendWebhook('donation', donationData);
        
        await ActivityLog.create({
            user_id: req.user.id,
            username: req.user.username,
            action: 'CREATE_DONATION',
            table_name: 'donations',
            record_id: donationId,
            description: `Registró donación de ${donationData.donor_name || donationData.player_name}: $${donationData.amount}`,
            ip_address: req.ip
        });
        
        res.json({ success: true, id: donationId });
    } catch (error) {
        console.error('Error al crear donación:', error);
        res.status(500).json({ error: 'Error al crear donación: ' + error.message });
    }
});

// Actualizar estado de donación
router.patch('/donations/:id/status', isAuthenticated, async (req, res) => {
    try {
        const { status } = req.body;
        await Donation.updateStatus(req.params.id, status);
        
        await ActivityLog.create({
            user_id: req.user.id,
            username: req.user.username,
            action: 'UPDATE_DONATION_STATUS',
            table_name: 'donations',
            record_id: req.params.id,
            description: `Cambió estado de donación #${req.params.id} a ${status}`,
            ip_address: req.ip
        });
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({ error: 'Error al actualizar estado' });
    }
});

// Actualizar donación
router.put('/donations/:id', isAuthenticated, async (req, res) => {
    try {
        await Donation.update(req.params.id, req.body);
        
        await ActivityLog.create({
            user_id: req.user.id,
            username: req.user.username,
            action: 'UPDATE_DONATION',
            table_name: 'donations',
            record_id: req.params.id,
            description: `Actualizó donación #${req.params.id}`,
            ip_address: req.ip
        });
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error al actualizar donación:', error);
        res.status(500).json({ error: 'Error al actualizar donación' });
    }
});

// Eliminar donación
router.delete('/donations/:id', isAuthenticated, async (req, res) => {
    try {
        await Donation.delete(req.params.id);
        
        await ActivityLog.create({
            user_id: req.user.id,
            username: req.user.username,
            action: 'DELETE_DONATION',
            table_name: 'donations',
            record_id: req.params.id,
            description: `Eliminó donación #${req.params.id}`,
            ip_address: req.ip
        });
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error al eliminar donación:', error);
        res.status(500).json({ error: 'Error al eliminar donación' });
    }
});

// ============ ESTADÍSTICAS ============

router.get('/stats', isAuthenticated, async (req, res) => {
    try {
        const [banStats, jailStats, hackerStats, refundStats, donationStats] = await Promise.all([
            Ban.getStats().catch(() => ({ total: 0, active: 0 })),
            Jail.getStats().catch(() => ({ total: 0, active: 0 })),
            Hacker.getStats().catch(() => ({ total: 0, pending: 0 })),
            Refund.getStats().catch(() => ({ total: 0, pending: 0 })),
            Donation.getStats().catch(() => ({ total: 0 }))
        ]);
        
        const totalRevenue = await Donation.getTotalRevenue().catch(() => 0);
        
        res.json({
            bans: banStats || { total: 0, active: 0 },
            jails: jailStats || { total: 0, active: 0 },
            hackers: hackerStats || { total: 0, pending: 0 },
            refunds: refundStats || { total: 0, pending: 0 },
            donations: donationStats || { total: 0 },
            totalRevenue: totalRevenue || 0
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.json({
            bans: { total: 0, active: 0 },
            jails: { total: 0, active: 0 },
            hackers: { total: 0, pending: 0 },
            refunds: { total: 0, pending: 0 },
            donations: { total: 0 },
            totalRevenue: 0
        });
    }
});

// ============ LOGS DE ACTIVIDAD ============

router.get('/activity-logs', isAuthenticated, async (req, res) => {
    try {
        const { user_id, action, limit } = req.query;
        let logs;
        
        if (user_id) {
            logs = await ActivityLog.getByUser(user_id, limit || 50);
        } else if (action) {
            logs = await ActivityLog.getByAction(action, limit || 100);
        } else {
            logs = await ActivityLog.getRecent(limit || 100);
        }
        
        res.json(logs);
    } catch (error) {
        console.error('Error al obtener logs:', error);
        res.status(500).json({ error: 'Error al obtener logs' });
    }
});

// ============ DISCORD USER CHECKER ============

// Verificar usuario de Discord por ID
router.get('/discord/check/:userId', isAuthenticated, async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId || !/^\d{17,19}$/.test(userId)) {
            return res.status(400).json({ error: 'ID de Discord inválido' });
        }

        // Intentar obtener el usuario de Discord
        let user;
        try {
            user = await discordClient.users.fetch(userId);
        } catch (error) {
            return res.status(404).json({ error: 'Usuario no encontrado en Discord' });
        }

        // ============================================
        // VERIFICAR EN ANALYSTIC API
        // ============================================
        
        const analysticData = await checkAnalysticAPI(userId);

        // Calcular antigüedad de la cuenta
        const createdTimestamp = user.createdTimestamp;
        const accountAgeDays = Math.floor((Date.now() - createdTimestamp) / (1000 * 60 * 60 * 24));
        
        // ============================================
        // ANÁLISIS DE SERVIDORES DE HACKS
        // ============================================
        
        // Lista ampliada de palabras clave de servidores de hacks/cheats de FiveM
        const hackKeywords = [
            // Hacks generales
            'hack', 'cheat', 'esp', 'aimbot', 'wallhack', 'triggerbot',
            // Mod menus
            'mod menu', 'menu mod', 'executor', 'injector', 'loader',
            // FiveM específico
            'fivem hack', 'fivem cheat', 'fivem mod', 'fivem esp', 'fivem aimbot',
            'gta hack', 'gta cheat', 'gta mod menu',
            // Términos de venta
            'cheat shop', 'hack shop', 'premium cheat', 'vip cheat', 'private cheat',
            'buy cheat', 'sell cheat', 'selling', 'cheap hack',
            // Términos técnicos
            'exploit', 'bypass', 'undetected', 'ud', 'private hack', 'exclusive',
            'lua executor', 'script executor', 'eulen', 'redengine',
            // Términos en español
            'hackear', 'trucos', 'trampas', 'mod menu español'
        ];
        
        // Lista de servidores conocidos de hacks (IDs reales - actualizar según descubrimiento)
        const knownHackServerIds = [
            // Aquí se pueden agregar IDs de servidores conocidos de hacks
            // Ejemplo: '123456789012345678'
        ];
        
        // Analizar TODOS los servidores donde el usuario está
        const suspiciousServers = [];
        const allUserGuilds = [];
        
        // Obtener guilds donde tanto el bot como el usuario están
        for (const guild of discordClient.guilds.cache.values()) {
            try {
                const member = await guild.members.fetch(userId).catch(() => null);
                
                if (member) {
                    allUserGuilds.push(guild);
                    
                    const guildNameLower = guild.name.toLowerCase();
                    const guildDescLower = guild.description?.toLowerCase() || '';
                    
                    // Verificar si está en lista negra conocida
                    if (knownHackServerIds.includes(guild.id)) {
                        suspiciousServers.push({
                            id: guild.id,
                            name: guild.name,
                            member_count: guild.memberCount,
                            reason: '🚨 Servidor en lista negra de hacks confirmados',
                            risk: 'CRITICAL'
                        });
                        continue;
                    }
                    
                    // Buscar palabras clave sospechosas
                    const matchedKeywords = hackKeywords.filter(keyword => 
                        guildNameLower.includes(keyword) || guildDescLower.includes(keyword)
                    );
                    
                    if (matchedKeywords.length > 0) {
                        // Calcular nivel de sospecha
                        let riskLevel = 'LOW';
                        const criticalKeywords = ['hack', 'cheat', 'mod menu', 'esp', 'aimbot', 'fivem hack'];
                        const hasCritical = matchedKeywords.some(kw => criticalKeywords.includes(kw));
                        
                        if (hasCritical && matchedKeywords.length >= 2) {
                            riskLevel = 'CRITICAL';
                        } else if (hasCritical || matchedKeywords.length >= 3) {
                            riskLevel = 'HIGH';
                        } else if (matchedKeywords.length >= 2) {
                            riskLevel = 'MEDIUM';
                        }
                        
                        suspiciousServers.push({
                            id: guild.id,
                            name: guild.name,
                            member_count: guild.memberCount,
                            reason: `Palabras clave detectadas: ${matchedKeywords.slice(0, 3).join(', ')}${matchedKeywords.length > 3 ? '...' : ''}`,
                            matched_keywords: matchedKeywords,
                            risk: riskLevel
                        });
                    }
                }
            } catch (error) {
                // Ignorar errores al obtener miembros de servidores específicos
                console.log(`No se pudo verificar servidor ${guild.name}`);
            }
        }
        
        // ============================================
        // ANÁLISIS DE ROLES SOSPECHOSOS
        // ============================================
        
        const suspiciousRoles = [];
        const suspiciousRoleKeywords = [
            // Roles de compradores
            'buyer', 'customer', 'purchased', 'verified buyer', 'premium member',
            'vip', 'donor', 'lifetime', 'subscribed',
            // Roles en español
            'comprador', 'cliente', 'verificado', 'premium', 'vitalicio',
            // Roles de acceso
            'hwid reset', 'licensed', 'active user', 'cheat user', 'hack user'
        ];
        
        for (const guild of allUserGuilds) {
            try {
                const member = await guild.members.fetch(userId);
                
                for (const role of member.roles.cache.values()) {
                    const roleNameLower = role.name.toLowerCase();
                    
                    // Verificar si el rol contiene palabras sospechosas
                    const matchedKeywords = suspiciousRoleKeywords.filter(keyword => 
                        roleNameLower.includes(keyword)
                    );
                    
                    if (matchedKeywords.length > 0) {
                        suspiciousRoles.push({
                            name: role.name,
                            server: guild.name,
                            server_suspicious: suspiciousServers.some(s => s.id === guild.id),
                            reason: matchedKeywords.join(', ')
                        });
                    }
                }
            } catch (error) {
                // Ignorar errores
            }
        }

        // Determinar insignias del usuario
        const badges = [];
        if (user.flags) {
            const flagsArray = user.flags.toArray();
            if (flagsArray.includes('Staff')) badges.push('👑 Staff de Discord');
            if (flagsArray.includes('Partner')) badges.push('🤝 Partner');
            if (flagsArray.includes('VerifiedBot')) badges.push('✅ Bot Verificado');
            if (flagsArray.includes('BugHunterLevel1')) badges.push('🐛 Bug Hunter Lv1');
            if (flagsArray.includes('BugHunterLevel2')) badges.push('🐛 Bug Hunter Lv2');
            if (flagsArray.includes('HypeSquadEvents')) badges.push('🎉 HypeSquad Events');
            if (flagsArray.includes('PremiumEarlySupporter')) badges.push('⭐ Early Supporter');
            if (flagsArray.includes('VerifiedDeveloper')) badges.push('⚙️ Verified Developer');
            if (flagsArray.includes('ActiveDeveloper')) badges.push('⚙️ Active Developer');
        }

        // ============================================
        // CALCULAR TRUST SCORE (0-100)
        // ============================================
        
        let trustScore = 50; // Base
        
        // Antigüedad de cuenta (+30 puntos máximo)
        if (accountAgeDays > 365) trustScore += 30;
        else if (accountAgeDays > 180) trustScore += 20;
        else if (accountAgeDays > 90) trustScore += 10;
        else if (accountAgeDays < 30) trustScore -= 20;
        else if (accountAgeDays < 7) trustScore -= 30;
        
        // Insignias de Discord (+5 puntos por insignia legítima)
        trustScore += badges.length * 5;
        
        // PENALIZACIONES POR SERVIDORES SOSPECHOSOS
        for (const server of suspiciousServers) {
            if (server.risk === 'CRITICAL') trustScore -= 40;
            else if (server.risk === 'HIGH') trustScore -= 30;
            else if (server.risk === 'MEDIUM') trustScore -= 20;
            else trustScore -= 10;
        }
        
        // Roles sospechosos (-25 puntos por rol en servidor sospechoso, -10 en servidor normal)
        for (const role of suspiciousRoles) {
            if (role.server_suspicious) {
                trustScore -= 25; // Rol de comprador en servidor de hacks
            } else {
                trustScore -= 10; // Rol sospechoso pero servidor no confirmado
            }
        }
        
        // Bot no verificado (-15 puntos)
        if (user.bot && !user.flags?.toArray().includes('VerifiedBot')) {
            trustScore -= 15;
        }
        
        // ============================================
        // PENALIZACIONES POR ANALYSTIC API
        // ============================================
        
        if (analysticData.isCheatCustomer) {
            // PENALIZACIÓN MÁXIMA si es cliente confirmado de cheats
            trustScore -= 50;
            if (riskLevel !== 'critical') riskLevel = 'critical';
        }
        
        // Limitar entre 0 y 100
        trustScore = Math.max(0, Math.min(100, trustScore));

        // ============================================
        // ANÁLISIS DE RIESGO
        // ============================================
        
        const warnings = [];
        let riskLevel = 'low';

        // ============================================
        // ANALYSTIC API - MÁXIMA PRIORIDAD
        // ============================================
        
        if (analysticData.isCheatCustomer) {
            warnings.push(`🚨 ALERTA CRÍTICA: Cliente CONFIRMADO de ${analysticData.cheatSoftware.join(', ')}`);
            riskLevel = 'critical';
        }

        // SERVIDORES SOSPECHOSOS - MÁXIMA PRIORIDAD
        if (suspiciousServers.length > 0) {
            const criticalCount = suspiciousServers.filter(s => s.risk === 'CRITICAL').length;
            const highCount = suspiciousServers.filter(s => s.risk === 'HIGH').length;
            
            if (criticalCount > 0) {
                warnings.push(`🚨 DETECTADO en ${criticalCount} servidor(es) CONFIRMADO(S) de hacks`);
                riskLevel = 'critical';
            } else if (highCount > 0) {
                warnings.push(`⚠️ Detectado en ${highCount} servidor(es) ALTAMENTE sospechoso(s) de hacks`);
                riskLevel = 'high';
            } else {
                warnings.push(`⚠️ Detectado en ${suspiciousServers.length} servidor(es) potencialmente relacionado(s) con cheats`);
                if (riskLevel !== 'critical') riskLevel = 'high';
            }
        }

        // ROLES SOSPECHOSOS
        if (suspiciousRoles.length > 0) {
            const rolesInHackServers = suspiciousRoles.filter(r => r.server_suspicious).length;
            
            if (rolesInHackServers > 0) {
                warnings.push(`💳 Tiene ${rolesInHackServers} rol(es) de COMPRADOR en servidores de hacks`);
                if (riskLevel !== 'critical') riskLevel = 'high';
            } else {
                warnings.push(`⚠️ Tiene ${suspiciousRoles.length} rol(es) sospechoso(s)`);
                if (riskLevel === 'low') riskLevel = 'medium';
            }
        }

        // Cuenta muy nueva
        if (accountAgeDays < 7) {
            warnings.push('🆕 Cuenta EXTREMADAMENTE nueva (menos de 7 días)');
            if (riskLevel === 'low') riskLevel = 'high';
        } else if (accountAgeDays < 30) {
            warnings.push('🆕 Cuenta muy nueva (menos de 30 días)');
            if (riskLevel === 'low') riskLevel = 'medium';
        }

        // Bot no verificado
        if (user.bot && !user.flags?.toArray().includes('VerifiedBot')) {
            warnings.push('🤖 Es un bot no verificado');
            if (riskLevel === 'low') riskLevel = 'medium';
        }

        // Trust score muy bajo
        if (trustScore < 20 && riskLevel !== 'critical') {
            riskLevel = 'high';
        } else if (trustScore < 40 && riskLevel === 'low') {
            riskLevel = 'medium';
        }

        // Preparar respuesta
        const userData = {
            user: {
                id: user.id,
                username: user.username,
                discriminator: user.discriminator,
                display_name: user.displayName || user.username,
                avatar_url: user.displayAvatarURL({ size: 256, dynamic: true }),
                banner_url: user.bannerURL({ size: 1024 }) || null,
                bot: user.bot,
                created_at: new Date(createdTimestamp).toLocaleString('es-ES')
            },
            total_servers: allUserGuilds.length,
            account_age_days: accountAgeDays,
            badges: badges,
            warnings: warnings,
            risk_level: riskLevel,
            trust_score: trustScore,
            suspicious_servers: suspiciousServers,
            suspicious_roles: suspiciousRoles,
            // Estadísticas adicionales
            stats: {
                critical_servers: suspiciousServers.filter(s => s.risk === 'CRITICAL').length,
                high_risk_servers: suspiciousServers.filter(s => s.risk === 'HIGH').length,
                buyer_roles: suspiciousRoles.filter(r => r.server_suspicious).length
            },
            // Datos de Analystic API
            analystic: {
                is_cheat_customer: analysticData.isCheatCustomer,
                cheat_software: analysticData.cheatSoftware,
                user_data: analysticData.userData,
                messages_url: analysticData.messages?.url || null,
                message_count: analysticData.messages?.messages?.length || 0,
                identifiers: analysticData.identifiers,
                has_steam: analysticData.identifiers?.steam?.length > 0 || false,
                has_license: analysticData.identifiers?.license?.length > 0 || false
            }
        };

        // Registrar actividad
        await ActivityLog.create({
            user_id: req.user.id,
            username: req.user.username,
            action: 'CHECK_DISCORD_USER',
            table_name: 'discord',
            record_id: userId,
            description: `Verificó usuario: ${user.username} | Trust: ${trustScore} | Risk: ${riskLevel} | Servidores sospechosos: ${suspiciousServers.length}`,
            ip_address: req.ip
        });

        res.json(userData);

    } catch (error) {
        console.error('Error al verificar usuario de Discord:', error);
        res.status(500).json({ error: 'Error al verificar usuario' });
    }
});

// Verificar si un usuario está en servidores de hacks
router.get('/discord/check-hack-servers/:userId', isAuthenticated, async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Lista de IDs de servidores conocidos de hacks (puedes personalizar esto)
        const knownHackServerIds = [
            // Agrega aquí los IDs de servidores conocidos de hacks
            // Ejemplo: '123456789012345678'
        ];

        const hackServers = [];
        
        for (const guild of discordClient.guilds.cache.values()) {
            // Verificar si el servidor está en la lista negra
            const isHackServer = guild.name.toLowerCase().includes('hack') ||
                                guild.name.toLowerCase().includes('cheat') ||
                                guild.name.toLowerCase().includes('exploit') ||
                                knownHackServerIds.includes(guild.id);
            
            if (isHackServer && guild.members.cache.has(userId)) {
                hackServers.push({
                    id: guild.id,
                    name: guild.name,
                    member_count: guild.memberCount
                });
            }
        }

        res.json({
            is_in_hack_servers: hackServers.length > 0,
            hack_servers: hackServers,
            total: hackServers.length
        });

    } catch (error) {
        console.error('Error al verificar servidores de hack:', error);
        res.status(500).json({ error: 'Error al verificar servidores' });
    }
});

// ============ BLACKLIST ============

// Obtener blacklist completa
router.get('/blacklist', isAuthenticated, async (req, res) => {
    try {
        const { search } = req.query;
        let blacklist;
        
        if (search) {
            blacklist = await Blacklist.search(search);
        } else {
            blacklist = await Blacklist.getAll();
        }
        
        res.json({ blacklist });
    } catch (error) {
        console.error('Error al obtener blacklist:', error);
        res.status(500).json({ error: 'Error al obtener blacklist' });
    }
});

// Agregar a blacklist
router.post('/blacklist', isAuthenticated, async (req, res) => {
    try {
        const { discord_id, username, reason } = req.body;
        
        // Verificar si ya está en blacklist
        const isBlacklisted = await Blacklist.isBlacklisted(discord_id);
        if (isBlacklisted) {
            return res.status(400).json({ error: 'Usuario ya está en blacklist' });
        }
        
        const blacklistData = {
            discord_id,
            username,
            reason,
            added_by: req.user.id,
            added_by_name: req.user.username
        };
        
        const id = await Blacklist.create(blacklistData);
        
        // Registrar actividad
        await ActivityLog.create({
            user_id: req.user.id,
            username: req.user.username,
            action: 'ADD_BLACKLIST',
            table_name: 'blacklist',
            record_id: id,
            description: `Agregó a ${username} a la blacklist: ${reason}`,
            ip_address: req.ip
        });
        
        res.json({ success: true, id });
    } catch (error) {
        console.error('Error al agregar a blacklist:', error);
        res.status(500).json({ error: 'Error al agregar a blacklist' });
    }
});

// Verificar si está en blacklist
router.get('/blacklist/check/:discordId', isAuthenticated, async (req, res) => {
    try {
        const { discordId } = req.params;
        const isBlacklisted = await Blacklist.isBlacklisted(discordId);
        const data = isBlacklisted ? await Blacklist.getByDiscordId(discordId) : null;
        
        res.json({
            is_blacklisted: isBlacklisted,
            data: data
        });
    } catch (error) {
        console.error('Error al verificar blacklist:', error);
        res.status(500).json({ error: 'Error al verificar blacklist' });
    }
});

// Remover de blacklist
router.delete('/blacklist/:discordId', isAuthenticated, async (req, res) => {
    try {
        const { discordId } = req.params;
        const removed = await Blacklist.remove(discordId);
        
        if (removed) {
            await ActivityLog.create({
                user_id: req.user.id,
                username: req.user.username,
                action: 'REMOVE_BLACKLIST',
                table_name: 'blacklist',
                record_id: discordId,
                description: `Removió usuario ${discordId} de la blacklist`,
                ip_address: req.ip
            });
            
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado en blacklist' });
        }
    } catch (error) {
        console.error('Error al remover de blacklist:', error);
        res.status(500).json({ error: 'Error al remover de blacklist' });
    }
});

// ============ WHITELIST ============

// Obtener whitelist completa
router.get('/whitelist', isAuthenticated, async (req, res) => {
    try {
        const { search } = req.query;
        let whitelist;
        
        if (search) {
            whitelist = await Whitelist.search(search);
        } else {
            whitelist = await Whitelist.getAll();
        }
        
        res.json({ whitelist });
    } catch (error) {
        console.error('Error al obtener whitelist:', error);
        res.status(500).json({ error: 'Error al obtener whitelist' });
    }
});

// Agregar a whitelist
router.post('/whitelist', isAuthenticated, async (req, res) => {
    try {
        const { discord_id, username } = req.body;
        
        // Verificar si ya está en whitelist
        const isWhitelisted = await Whitelist.isWhitelisted(discord_id);
        if (isWhitelisted) {
            return res.status(400).json({ error: 'Usuario ya está en whitelist' });
        }
        
        // Obtener nombre de usuario de Discord si no se proporciona
        let finalUsername = username;
        if (!finalUsername) {
            try {
                const user = await discordClient.users.fetch(discord_id);
                finalUsername = user.username;
            } catch (error) {
                finalUsername = 'Unknown';
            }
        }
        
        const whitelistData = {
            discord_id,
            username: finalUsername,
            added_by: req.user.id,
            added_by_name: req.user.username
        };
        
        const id = await Whitelist.create(whitelistData);
        
        // Registrar actividad
        await ActivityLog.create({
            user_id: req.user.id,
            username: req.user.username,
            action: 'ADD_WHITELIST',
            table_name: 'whitelist',
            record_id: id,
            description: `Agregó a ${finalUsername} a la whitelist`,
            ip_address: req.ip
        });
        
        res.json({ success: true, id });
    } catch (error) {
        console.error('Error al agregar a whitelist:', error);
        res.status(500).json({ error: 'Error al agregar a whitelist' });
    }
});

// Verificar si está en whitelist
router.get('/whitelist/check/:discordId', isAuthenticated, async (req, res) => {
    try {
        const { discordId } = req.params;
        const isWhitelisted = await Whitelist.isWhitelisted(discordId);
        
        res.json({ is_whitelisted: isWhitelisted });
    } catch (error) {
        console.error('Error al verificar whitelist:', error);
        res.status(500).json({ error: 'Error al verificar whitelist' });
    }
});

// Remover de whitelist
router.delete('/whitelist/:discordId', isAuthenticated, async (req, res) => {
    try {
        const { discordId } = req.params;
        const removed = await Whitelist.remove(discordId);
        
        if (removed) {
            await ActivityLog.create({
                user_id: req.user.id,
                username: req.user.username,
                action: 'REMOVE_WHITELIST',
                table_name: 'whitelist',
                record_id: discordId,
                description: `Removió usuario ${discordId} de la whitelist`,
                ip_address: req.ip
            });
            
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado en whitelist' });
        }
    } catch (error) {
        console.error('Error al remover de whitelist:', error);
        res.status(500).json({ error: 'Error al remover de whitelist' });
    }
});

// ============ NOTAS DE USUARIOS ============

// Obtener notas de un usuario
router.get('/user-notes/:discordId', isAuthenticated, async (req, res) => {
    try {
        const { discordId } = req.params;
        const notes = await UserNote.getByDiscordId(discordId);
        
        res.json({ notes });
    } catch (error) {
        console.error('Error al obtener notas:', error);
        res.status(500).json({ error: 'Error al obtener notas' });
    }
});

// Crear nota sobre un usuario
router.post('/user-notes', isAuthenticated, async (req, res) => {
    try {
        const { discord_id, username, note } = req.body;
        
        const noteData = {
            discord_id,
            username,
            note,
            created_by: req.user.id,
            created_by_name: req.user.username
        };
        
        const id = await UserNote.create(noteData);
        
        // Registrar actividad
        await ActivityLog.create({
            user_id: req.user.id,
            username: req.user.username,
            action: 'CREATE_USER_NOTE',
            table_name: 'user_notes',
            record_id: id,
            description: `Agregó nota sobre ${username}`,
            ip_address: req.ip
        });
        
        res.json({ success: true, id });
    } catch (error) {
        console.error('Error al crear nota:', error);
        res.status(500).json({ error: 'Error al crear nota' });
    }
});

// Obtener todas las notas
router.get('/user-notes', isAuthenticated, async (req, res) => {
    try {
        const { search, limit } = req.query;
        let notes;
        
        if (search) {
            notes = await UserNote.search(search);
        } else {
            notes = await UserNote.getAll(limit || 100);
        }
        
        res.json({ notes });
    } catch (error) {
        console.error('Error al obtener notas:', error);
        res.status(500).json({ error: 'Error al obtener notas' });
    }
});

// Eliminar nota
router.delete('/user-notes/:id', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await UserNote.delete(id);
        
        if (deleted) {
            await ActivityLog.create({
                user_id: req.user.id,
                username: req.user.username,
                action: 'DELETE_USER_NOTE',
                table_name: 'user_notes',
                record_id: id,
                description: `Eliminó nota #${id}`,
                ip_address: req.ip
            });
            
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Nota no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar nota:', error);
        res.status(500).json({ error: 'Error al eliminar nota' });
    }
});

module.exports = router;
