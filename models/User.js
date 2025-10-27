const db = require('../config/database');

class User {
    static async findByDiscordId(discordId) {
        const [rows] = await db.query(
            'SELECT * FROM users WHERE discord_id = ? AND is_active = TRUE',
            [discordId]
        );
        return rows[0];
    }

    static async create(userData) {
        const { discord_id, username, discriminator, avatar, role_id } = userData;
        const [result] = await db.query(
            'INSERT INTO users (discord_id, username, discriminator, avatar, role_id) VALUES (?, ?, ?, ?, ?)',
            [discord_id, username, discriminator, avatar, role_id]
        );
        return result.insertId;
    }

    static async update(discordId, userData) {
        const { username, discriminator, avatar, role_id } = userData;
        await db.query(
            'UPDATE users SET username = ?, discriminator = ?, avatar = ?, role_id = ?, last_login = CURRENT_TIMESTAMP WHERE discord_id = ?',
            [username, discriminator, avatar, role_id, discordId]
        );
    }

    static async deactivate(discordId) {
        await db.query(
            'UPDATE users SET is_active = FALSE WHERE discord_id = ?',
            [discordId]
        );
    }

    static async activate(discordId) {
        await db.query(
            'UPDATE users SET is_active = TRUE WHERE discord_id = ?',
            [discordId]
        );
    }

    static async getAll() {
        const [rows] = await db.query(
            'SELECT id, discord_id, username, discriminator, avatar, created_at, last_login, is_active FROM users ORDER BY created_at DESC'
        );
        return rows;
    }

    static async getActive() {
        const [rows] = await db.query(
            'SELECT id, discord_id, username, discriminator, avatar, created_at, last_login FROM users WHERE is_active = TRUE ORDER BY last_login DESC'
        );
        return rows;
    }
}

module.exports = User;
