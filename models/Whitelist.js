const db = require('../config/database');

class Whitelist {
    /**
     * Agregar usuario a la whitelist
     */
    static async create(data) {
        const query = `
            INSERT INTO whitelist (discord_id, username, added_by, added_by_name, created_at)
            VALUES (?, ?, ?, ?, NOW())
        `;
        
        const [result] = await db.execute(query, [
            data.discord_id,
            data.username || null,
            data.added_by,
            data.added_by_name
        ]);
        
        return result.insertId;
    }

    /**
     * Obtener todos los usuarios en whitelist
     */
    static async getAll() {
        const query = `
            SELECT * FROM whitelist
            ORDER BY created_at DESC
        `;
        
        const [rows] = await db.execute(query);
        return rows;
    }

    /**
     * Verificar si un usuario está en whitelist
     */
    static async isWhitelisted(discordId) {
        const query = `
            SELECT * FROM whitelist
            WHERE discord_id = ?
            LIMIT 1
        `;
        
        const [rows] = await db.execute(query, [discordId]);
        return rows.length > 0;
    }

    /**
     * Remover de whitelist
     */
    static async remove(discordId) {
        const query = `
            DELETE FROM whitelist
            WHERE discord_id = ?
        `;
        
        const [result] = await db.execute(query, [discordId]);
        return result.affectedRows > 0;
    }

    /**
     * Buscar en whitelist
     */
    static async search(searchTerm) {
        const query = `
            SELECT * FROM whitelist
            WHERE username LIKE ? OR discord_id LIKE ?
            ORDER BY created_at DESC
        `;
        
        const searchPattern = `%${searchTerm}%`;
        const [rows] = await db.execute(query, [searchPattern, searchPattern]);
        return rows;
    }
}

module.exports = Whitelist;
