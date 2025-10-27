const db = require('../config/database');

class Jail {
    static async create(jailData) {
        const { player_name, player_id, reason, duration, jailed_by, jailed_by_name, evidence_url, notes } = jailData;
        const [result] = await db.query(
            'INSERT INTO jail (player_name, player_id, reason, duration, jailed_by, jailed_by_name, evidence_url, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [player_name, player_id, reason, duration, jailed_by, jailed_by_name, evidence_url, notes]
        );
        return result.insertId;
    }

    static async getAll(limit = 100, offset = 0) {
        const [rows] = await db.query(
            'SELECT * FROM jail ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [limit, offset]
        );
        return rows;
    }

    static async getActive() {
        const [rows] = await db.query(
            'SELECT * FROM jail WHERE is_active = TRUE AND released_at IS NULL ORDER BY created_at DESC'
        );
        return rows;
    }

    static async searchByPlayer(searchTerm) {
        const [rows] = await db.query(
            'SELECT * FROM jail WHERE player_name LIKE ? OR player_id LIKE ? ORDER BY created_at DESC',
            [`%${searchTerm}%`, `%${searchTerm}%`]
        );
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query(
            'SELECT * FROM jail WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async release(id) {
        await db.query(
            'UPDATE jail SET is_active = FALSE, released_at = CURRENT_TIMESTAMP WHERE id = ?',
            [id]
        );
    }

    static async update(id, updateData) {
        const { reason, duration, evidence_url, notes } = updateData;
        await db.query(
            'UPDATE jail SET reason = ?, duration = ?, evidence_url = ?, notes = ? WHERE id = ?',
            [reason, duration, evidence_url, notes, id]
        );
    }

    static async delete(id) {
        await db.query('DELETE FROM jail WHERE id = ?', [id]);
    }

    static async getStats() {
        const [rows] = await db.query(
            'SELECT COUNT(*) as total, SUM(CASE WHEN is_active = TRUE AND released_at IS NULL THEN 1 ELSE 0 END) as active FROM jail'
        );
        return rows[0];
    }
}

module.exports = Jail;
