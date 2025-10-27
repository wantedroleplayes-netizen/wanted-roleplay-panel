const db = require('../config/database');

class Blacklist {
    /**
     * Agregar usuario a la blacklist
     */
    static async create(data) {
        const query = `
            INSERT INTO blacklist (discord_id, username, reason, added_by, added_by_name, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())
        `;
        
        const [result] = await db.execute(query, [
            data.discord_id,
            data.username,
            data.reason,
            data.added_by,
            data.added_by_name
        ]);
        
        return result.insertId;
    }

    /**
     * Obtener todos los usuarios en blacklist
     */
    static async getAll() {
        const query = `
            SELECT * FROM blacklist
            ORDER BY created_at DESC
        `;
        
        const [rows] = await db.execute(query);
        return rows;
    }

    /**
     * Verificar si un usuario está en blacklist
     */
    static async isBlacklisted(discordId) {
        const query = `
            SELECT * FROM blacklist
            WHERE discord_id = ?
            LIMIT 1
        `;
        
        const [rows] = await db.execute(query, [discordId]);
        return rows.length > 0;
    }

    /**
     * Obtener información de blacklist de un usuario
     */
    static async getByDiscordId(discordId) {
        const query = `
            SELECT * FROM blacklist
            WHERE discord_id = ?
            LIMIT 1
        `;
        
        const [rows] = await db.execute(query, [discordId]);
        return rows[0];
    }

    /**
     * Remover de blacklist
     */
    static async remove(discordId) {
        const query = `
            DELETE FROM blacklist
            WHERE discord_id = ?
        `;
        
        const [result] = await db.execute(query, [discordId]);
        return result.affectedRows > 0;
    }

    /**
     * Buscar en blacklist
     */
    static async search(searchTerm) {
        const query = `
            SELECT * FROM blacklist
            WHERE username LIKE ? OR discord_id LIKE ? OR reason LIKE ?
            ORDER BY created_at DESC
        `;
        
        const searchPattern = `%${searchTerm}%`;
        const [rows] = await db.execute(query, [searchPattern, searchPattern, searchPattern]);
        return rows;
    }
}

module.exports = Blacklist;
