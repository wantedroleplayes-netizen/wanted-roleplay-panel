const db = require('../config/database');

class Refund {
    static async create(refundData) {
        const { player_name, player_id, item_description, reason, amount, processed_by, processed_by_name, evidence_url, notes, status } = refundData;
        const [result] = await db.query(
            'INSERT INTO refunds (player_name, player_id, item_description, reason, amount, processed_by, processed_by_name, evidence_url, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [player_name, player_id, item_description, reason, amount, processed_by, processed_by_name, evidence_url, notes, status || 'pending']
        );
        return result.insertId;
    }

    static async getAll(limit = 100, offset = 0) {
        const [rows] = await db.query(
            'SELECT * FROM refunds ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [limit, offset]
        );
        return rows;
    }

    static async getByStatus(status) {
        const [rows] = await db.query(
            'SELECT * FROM refunds WHERE status = ? ORDER BY created_at DESC',
            [status]
        );
        return rows;
    }

    static async searchByPlayer(searchTerm) {
        const [rows] = await db.query(
            'SELECT * FROM refunds WHERE player_name LIKE ? OR player_id LIKE ? ORDER BY created_at DESC',
            [`%${searchTerm}%`, `%${searchTerm}%`]
        );
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query(
            'SELECT * FROM refunds WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async updateStatus(id, status) {
        await db.query(
            'UPDATE refunds SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, id]
        );
    }

    static async update(id, updateData) {
        const { item_description, reason, amount, evidence_url, notes, status } = updateData;
        await db.query(
            'UPDATE refunds SET item_description = ?, reason = ?, amount = ?, evidence_url = ?, notes = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [item_description, reason, amount, evidence_url, notes, status, id]
        );
    }

    static async delete(id) {
        await db.query('DELETE FROM refunds WHERE id = ?', [id]);
    }

    static async getStats() {
        const [rows] = await db.query(
            'SELECT COUNT(*) as total, SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) as pending, SUM(CASE WHEN status = "completed" THEN 1 ELSE 0 END) as completed FROM refunds'
        );
        return rows[0];
    }
}

module.exports = Refund;
