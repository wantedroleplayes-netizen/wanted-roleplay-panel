const db = require('../config/database');

class ChatMessage {
    static async create(messageData) {
        const { user_id, username, message } = messageData;
        const [result] = await db.query(
            'INSERT INTO chat_messages (user_id, username, message) VALUES (?, ?, ?)',
            [user_id, username, message]
        );
        return result.insertId;
    }

    static async getRecent(limit = 50) {
        const [rows] = await db.query(
            'SELECT * FROM chat_messages WHERE is_deleted = FALSE ORDER BY created_at DESC LIMIT ?',
            [limit]
        );
        return rows.reverse();
    }

    static async getAll(limit = 200, offset = 0) {
        const [rows] = await db.query(
            'SELECT * FROM chat_messages WHERE is_deleted = FALSE ORDER BY created_at ASC LIMIT ? OFFSET ?',
            [limit, offset]
        );
        return rows;
    }

    static async delete(id) {
        await db.query(
            'UPDATE chat_messages SET is_deleted = TRUE WHERE id = ?',
            [id]
        );
    }

    static async deleteHard(id) {
        await db.query('DELETE FROM chat_messages WHERE id = ?', [id]);
    }
}

module.exports = ChatMessage;
