const db = require('../config/database');

class Hacker {
    static async create(hackerData) {
        const { player_name, player_id, hack_type, description, evidence_url, reported_by, reported_by_name, action_taken, notes } = hackerData;
        const [result] = await db.query(
            'INSERT INTO hackers (player_name, player_id, hack_type, description, evidence_url, reported_by, reported_by_name, action_taken, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [player_name, player_id, hack_type, description, evidence_url, reported_by, reported_by_name, action_taken, notes]
        );
        return result.insertId;
    }

    static async getAll(limit = 100, offset = 0) {
        const [rows] = await db.query(
            'SELECT * FROM hackers ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [limit, offset]
        );
        return rows;
    }

    static async getUnresolved() {
        const [rows] = await db.query(
            'SELECT * FROM hackers WHERE is_resolved = FALSE ORDER BY created_at DESC'
        );
        return rows;
    }

    static async searchByPlayer(searchTerm) {
        const [rows] = await db.query(
            'SELECT * FROM hackers WHERE player_name LIKE ? OR player_id LIKE ? ORDER BY created_at DESC',
            [`%${searchTerm}%`, `%${searchTerm}%`]
        );
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query(
            'SELECT * FROM hackers WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async resolve(id, action_taken) {
        await db.query(
            'UPDATE hackers SET is_resolved = TRUE, action_taken = ? WHERE id = ?',
            [action_taken, id]
        );
    }

    static async update(id, updateData) {
        const { hack_type, description, evidence_url, action_taken, notes, is_resolved } = updateData;
        await db.query(
            'UPDATE hackers SET hack_type = ?, description = ?, evidence_url = ?, action_taken = ?, notes = ?, is_resolved = ? WHERE id = ?',
            [hack_type, description, evidence_url, action_taken, notes, is_resolved, id]
        );
    }

    static async delete(id) {
        await db.query('DELETE FROM hackers WHERE id = ?', [id]);
    }

    static async getStats() {
        const [rows] = await db.query(
            'SELECT COUNT(*) as total, SUM(is_resolved) as resolved, SUM(!is_resolved) as pending FROM hackers'
        );
        return rows[0];
    }
}

module.exports = Hacker;
