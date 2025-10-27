const db = require('../config/database');

class UserNote {
    /**
     * Crear nota sobre un usuario
     */
    static async create(data) {
        const query = `
            INSERT INTO user_notes (discord_id, username, note, created_by, created_by_name, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())
        `;
        
        const [result] = await db.execute(query, [
            data.discord_id,
            data.username,
            data.note,
            data.created_by,
            data.created_by_name
        ]);
        
        return result.insertId;
    }

    /**
     * Obtener todas las notas de un usuario
     */
    static async getByDiscordId(discordId) {
        const query = `
            SELECT * FROM user_notes
            WHERE discord_id = ?
            ORDER BY created_at DESC
        `;
        
        const [rows] = await db.execute(query, [discordId]);
        return rows;
    }

    /**
     * Obtener todas las notas
     */
    static async getAll(limit = 100) {
        const query = `
            SELECT * FROM user_notes
            ORDER BY created_at DESC
            LIMIT ?
        `;
        
        const [rows] = await db.execute(query, [limit]);
        return rows;
    }

    /**
     * Actualizar nota
     */
    static async update(id, note) {
        const query = `
            UPDATE user_notes
            SET note = ?, updated_at = NOW()
            WHERE id = ?
        `;
        
        const [result] = await db.execute(query, [note, id]);
        return result.affectedRows > 0;
    }

    /**
     * Eliminar nota
     */
    static async delete(id) {
        const query = `
            DELETE FROM user_notes
            WHERE id = ?
        `;
        
        const [result] = await db.execute(query, [id]);
        return result.affectedRows > 0;
    }

    /**
     * Buscar notas
     */
    static async search(searchTerm) {
        const query = `
            SELECT * FROM user_notes
            WHERE username LIKE ? OR discord_id LIKE ? OR note LIKE ?
            ORDER BY created_at DESC
        `;
        
        const searchPattern = `%${searchTerm}%`;
        const [rows] = await db.execute(query, [searchPattern, searchPattern, searchPattern]);
        return rows;
    }
}

module.exports = UserNote;
