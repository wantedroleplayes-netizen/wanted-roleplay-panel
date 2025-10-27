const db = require('../config/database');

class Donation {
    static async create(donationData) {
        const {
            donor_name,
            player_name,
            player_id,
            amount,
            currency,
            payment_method,
            transaction_id,
            message,
            notes,
            recorded_by,
            recorded_by_name
        } = donationData;
        
        const [result] = await db.query(
            `INSERT INTO donations (
                donor_name,
                player_id,
                amount,
                payment_method,
                transaction_id,
                message,
                notes,
                recorded_by,
                recorded_by_name
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                donor_name || player_name,
                player_id,
                amount,
                payment_method,
                transaction_id,
                message,
                notes,
                recorded_by,
                recorded_by_name
            ]
        );
        return result.insertId;
    }

    static async getAll(limit = 100, offset = 0) {
        const [rows] = await db.query(
            'SELECT * FROM donations ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [limit, offset]
        );
        return rows;
    }

    static async getByStatus(status) {
        const [rows] = await db.query(
            'SELECT * FROM donations WHERE status = ? ORDER BY created_at DESC',
            [status]
        );
        return rows;
    }

    static async searchByPlayer(searchTerm) {
        const [rows] = await db.query(
            'SELECT * FROM donations WHERE player_name LIKE ? OR player_id LIKE ? OR transaction_id LIKE ? ORDER BY created_at DESC',
            [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
        );
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query(
            'SELECT * FROM donations WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async updateStatus(id, status) {
        await db.query(
            'UPDATE donations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, id]
        );
    }

    static async update(id, updateData) {
        const { amount, currency, payment_method, transaction_id, package_name, status, notes } = updateData;
        await db.query(
            'UPDATE donations SET amount = ?, currency = ?, payment_method = ?, transaction_id = ?, package_name = ?, status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [amount, currency, payment_method, transaction_id, package_name, status, notes, id]
        );
    }

    static async delete(id) {
        await db.query('DELETE FROM donations WHERE id = ?', [id]);
    }

    static async getStats() {
        const [rows] = await db.query(
            'SELECT COUNT(*) as total FROM donations'
        );
        return rows[0] || { total: 0 };
    }

    static async getTotalRevenue() {
        const [rows] = await db.query(
            'SELECT SUM(amount) as total FROM donations'
        );
        return rows[0]?.total || 0;
    }
}

module.exports = Donation;
