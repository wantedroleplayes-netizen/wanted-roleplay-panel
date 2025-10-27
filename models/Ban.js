const db = require('../config/database');

class Ban {
    static async create(banData) {
        const { player_name, player_id, reason, duration, banned_by, banned_by_name, evidence_url, notes } = banData;
        const [result] = await db.query(
            'INSERT INTO bans (player_name, player_id, reason, duration, banned_by, banned_by_name, evidence_url, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [player_name, player_id, reason, duration, banned_by, banned_by_name, evidence_url, notes]
        );
        return result.insertId;
    }

    static async getAll(limit = 100, offset = 0) {
        const [rows] = await db.query(
            'SELECT * FROM bans ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [limit, offset]
        );
        return rows;
    }

    static async getActive() {
        const [rows] = await db.query(
            'SELECT * FROM bans WHERE is_active = TRUE ORDER BY created_at DESC'
        );
        return rows;
    }

    static async searchByPlayer(searchTerm) {
        const [rows] = await db.query(
            'SELECT * FROM bans WHERE player_name LIKE ? OR player_id LIKE ? ORDER BY created_at DESC',
            [`%${searchTerm}%`, `%${searchTerm}%`]
        );
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query(
            'SELECT * FROM bans WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async update(id, updateData) {
        const { reason, duration, evidence_url, notes, is_active } = updateData;
        await db.query(
            'UPDATE bans SET reason = ?, duration = ?, evidence_url = ?, notes = ?, is_active = ? WHERE id = ?',
            [reason, duration, evidence_url, notes, is_active, id]
        );
    }

    static async delete(id) {
        await db.query('DELETE FROM bans WHERE id = ?', [id]);
    }

    static async getStats() {
        const [rows] = await db.query(
            'SELECT COUNT(*) as total, SUM(is_active) as active FROM bans'
        );
        return rows[0];
    }
}

module.exports = Ban;
