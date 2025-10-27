const { Client, GatewayIntentBits } = require('discord.js');
const User = require('../models/User');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

const GUILD_ID = '1125513390161395812';
const ROLE_ID = '1127967840654336101';

client.once('clientReady', async () => {
    console.log(`✅ Bot de Discord conectado como ${client.user.tag}`);
    
    // Sincronizar usuarios al iniciar
    await syncUsers();
    
    // Sincronizar cada 5 minutos
    setInterval(syncUsers, 5 * 60 * 1000);
});

// Sincronizar usuarios con el rol específico
async function syncUsers() {
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        const members = await guild.members.fetch();
        
        console.log(`🔄 Sincronizando usuarios del servidor...`);
        
        // Obtener miembros con el rol específico
        const staffMembers = members.filter(member => 
            member.roles.cache.has(ROLE_ID)
        );
        
        console.log(`👥 ${staffMembers.size} miembros con rol de staff encontrados`);
        
        // Actualizar o crear usuarios en la base de datos
        for (const [, member] of staffMembers) {
            const userData = {
                discord_id: member.user.id,
                username: member.user.username,
                discriminator: member.user.discriminator,
                avatar: member.user.avatar,
                role_id: ROLE_ID
            };
            
            const existingUser = await User.findByDiscordId(member.user.id);
            
            if (existingUser) {
                await User.update(member.user.id, userData);
                await User.activate(member.user.id);
            } else {
                await User.create(userData);
                console.log(`✅ Nuevo usuario creado: ${member.user.username}`);
            }
        }
        
        // Desactivar usuarios que ya no tienen el rol
        const allUsers = await User.getActive();
        for (const user of allUsers) {
            const member = members.get(user.discord_id);
            if (!member || !member.roles.cache.has(ROLE_ID)) {
                await User.deactivate(user.discord_id);
                console.log(`❌ Usuario desactivado: ${user.username}`);
            }
        }
        
        console.log('✅ Sincronización completada');
    } catch (error) {
        console.error('❌ Error al sincronizar usuarios:', error);
    }
}

// Evento cuando un miembro obtiene el rol
client.on('guildMemberUpdate', async (oldMember, newMember) => {
    if (newMember.guild.id !== GUILD_ID) return;
    
    const hadRole = oldMember.roles.cache.has(ROLE_ID);
    const hasRole = newMember.roles.cache.has(ROLE_ID);
    
    if (!hadRole && hasRole) {
        // Usuario obtuvo el rol
        const userData = {
            discord_id: newMember.user.id,
            username: newMember.user.username,
            discriminator: newMember.user.discriminator,
            avatar: newMember.user.avatar,
            role_id: ROLE_ID
        };
        
        const existingUser = await User.findByDiscordId(newMember.user.id);
        
        if (existingUser) {
            await User.activate(newMember.user.id);
            await User.update(newMember.user.id, userData);
        } else {
            await User.create(userData);
        }
        
        console.log(`✅ Usuario añadido al staff: ${newMember.user.username}`);
    } else if (hadRole && !hasRole) {
        // Usuario perdió el rol
        await User.deactivate(newMember.user.id);
        console.log(`❌ Usuario removido del staff: ${newMember.user.username}`);
    }
});

// Evento cuando un miembro sale del servidor
client.on('guildMemberRemove', async (member) => {
    if (member.guild.id !== GUILD_ID) return;
    
    if (member.roles.cache.has(ROLE_ID)) {
        await User.deactivate(member.user.id);
        console.log(`❌ Usuario salió del servidor: ${member.user.username}`);
    }
});

// Iniciar el bot
function startBot() {
    const token = process.env.DISCORD_BOT_TOKEN;
    
    if (!token) {
        console.error('❌ No se encontró DISCORD_BOT_TOKEN en las variables de entorno');
        return;
    }
    
    client.login(token).catch(err => {
        console.error('❌ Error al iniciar el bot de Discord:', err);
    });
}

module.exports = { client, startBot, syncUsers };
