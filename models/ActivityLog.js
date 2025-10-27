const db = require('../config/database');

class ActivityLog {
    static async create(logData) {
        const { user_id, username, action, table_name, record_id, description, ip_address } = logData;
        const [result] = await db.query(
            'INSERT INTO activity_logs (user_id, username, action, table_name, record_id, description, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user_id, username, action, table_name, record_id, description, ip_address]
        );
        return result.insertId;
    }

    static async getRecent(limit = 100) {
        const [rows] = await db.query(
            `SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT ${parseInt(limit)}`,
            []
        );
        return rows;
    }

    static async getByUser(userId, limit = 50) {
        const [rows] = await db.query(
            `SELECT * FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT ${parseInt(limit)}`,
            [userId]
        );
        return rows;
    }

    static async getByAction(action, limit = 100) {
        const [rows] = await db.query(
            `SELECT * FROM activity_logs WHERE action = ? ORDER BY created_at DESC LIMIT ${parseInt(limit)}`,
            [action]
        );
        return rows;
    }

    static async getByDateRange(startDate, endDate) {
        const [rows] = await db.query(
            'SELECT * FROM activity_logs WHERE created_at BETWEEN ? AND ? ORDER BY created_at DESC',
            [startDate, endDate]
        );
        return rows;
    }
}

module.exports = ActivityLog;
