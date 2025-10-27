const axios = require('axios');
require('dotenv').config();

// URLs de webhooks individuales para cada tipo
const WEBHOOKS = {
    ban: process.env.DISCORD_WEBHOOK_BANS,
    jail: process.env.DISCORD_WEBHOOK_JAILS,
    hacker: process.env.DISCORD_WEBHOOK_HACKERS,
    refund: process.env.DISCORD_WEBHOOK_REFUNDS,
    donation: process.env.DISCORD_WEBHOOK_DONATIONS
};

// Colores para los embeds
const COLORS = {
    ban: 0xFF0000,      // Rojo
    jail: 0xFFA500,     // Naranja
    hacker: 0x800080,   // Púrpura
    refund: 0x00BFFF,   // Azul claro
    donation: 0x00FF00  // Verde
};

async function sendWebhook(type, data) {
    const webhookUrl = WEBHOOKS[type];
    
    if (!webhookUrl) {
        console.warn(`⚠️ No se configuró webhook para: ${type}`);
        return;
    }

    try {
        let embed = createEmbed(type, data);
        
        await axios.post(webhookUrl, {
            username: 'Wanted Roleplay Staff',
            avatar_url: 'https://i.imgur.com/4M34hi2.png',
            embeds: [embed]
        });
        
        console.log(`✅ Webhook enviado: ${type}`);
    } catch (error) {
        console.error(`❌ Error al enviar webhook (${type}):`, error.message);
    }
}

function createEmbed(type, data) {
    const timestamp = new Date().toISOString();
    
    switch (type) {
        case 'ban':
            return {
                title: '🔨 Nuevo Baneo Registrado',
                color: COLORS.ban,
                fields: [
                    { name: '👤 Jugador', value: data.player_name, inline: true },
                    { name: '🆔 ID', value: data.player_id || 'N/A', inline: true },
                    { name: '⏱️ Duración', value: data.duration || 'Permanente', inline: true },
                    { name: '📝 Razón', value: data.reason },
                    { name: '👮 Baneado por', value: data.banned_by_name, inline: true },
                    { name: '🔗 Evidencia', value: data.evidence_url || 'No proporcionada', inline: false }
                ],
                footer: { text: 'Wanted Roleplay' },
                timestamp: timestamp
            };
            
        case 'jail':
            return {
                title: '⛓️ Nuevo Jail Registrado',
                color: COLORS.jail,
                fields: [
                    { name: '👤 Jugador', value: data.player_name, inline: true },
                    { name: '🆔 ID', value: data.player_id || 'N/A', inline: true },
                    { name: '⏱️ Duración', value: data.duration, inline: true },
                    { name: '📝 Razón', value: data.reason },
                    { name: '👮 Encarcelado por', value: data.jailed_by_name, inline: true },
                    { name: '🔗 Evidencia', value: data.evidence_url || 'No proporcionada', inline: false }
                ],
                footer: { text: 'Wanted Roleplay' },
                timestamp: timestamp
            };
            
        case 'hacker':
            return {
                title: '⚠️ Hacker Reportado',
                color: COLORS.hacker,
                fields: [
                    { name: '👤 Jugador', value: data.player_name, inline: true },
                    { name: '🆔 ID', value: data.player_id || 'N/A', inline: true },
                    { name: '🎯 Tipo de Hack', value: data.hack_type, inline: true },
                    { name: '📝 Descripción', value: data.description },
                    { name: '👮 Reportado por', value: data.reported_by_name, inline: true },
                    { name: '🔗 Evidencia', value: data.evidence_url || 'No proporcionada', inline: false }
                ],
                footer: { text: 'Wanted Roleplay' },
                timestamp: timestamp
            };
            
        case 'refund':
            return {
                title: '💰 Nueva Devolución',
                color: COLORS.refund,
                fields: [
                    { name: '👤 Jugador', value: data.player_name, inline: true },
                    { name: '🆔 ID', value: data.player_id || 'N/A', inline: true },
                    { name: '📦 Cantidad', value: data.amount || 'N/A', inline: true },
                    { name: '📝 Descripción', value: data.item_description },
                    { name: '💭 Razón', value: data.reason },
                    { name: '👮 Procesado por', value: data.processed_by_name, inline: true },
                    { name: '📊 Estado', value: data.status || 'pending', inline: true },
                    { name: '🔗 Evidencia', value: data.evidence_url || 'No proporcionada', inline: false }
                ],
                footer: { text: 'Wanted Roleplay' },
                timestamp: timestamp
            };
            
        case 'donation':
            return {
                title: '💳 Nueva Donación Registrada',
                color: COLORS.donation,
                fields: [
                    { name: '👤 Jugador', value: data.player_name, inline: true },
                    { name: '🆔 ID', value: data.player_id || 'N/A', inline: true },
                    { name: '💵 Cantidad', value: `${data.amount} ${data.currency || 'USD'}`, inline: true },
                    { name: '📦 Paquete', value: data.package_name || 'N/A', inline: true },
                    { name: '💳 Método de Pago', value: data.payment_method || 'N/A', inline: true },
                    { name: '🔖 ID Transacción', value: data.transaction_id || 'N/A', inline: true },
                    { name: '👮 Registrado por', value: data.registered_by_name, inline: true },
                    { name: '📊 Estado', value: data.status || 'pending', inline: true }
                ],
                footer: { text: 'Wanted Roleplay' },
                timestamp: timestamp
            };
            
        default:
            return {
                title: '📋 Nueva Entrada',
                color: 0x808080,
                description: JSON.stringify(data, null, 2),
                footer: { text: 'Wanted Roleplay' },
                timestamp: timestamp
            };
    }
}

module.exports = { sendWebhook };
