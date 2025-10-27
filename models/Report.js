const db = require('../config/database');

class Report {
    // Crear nuevo reporte
    static async create(data) {
        const { 
            reported_user_id, 
            reported_user_name, 
            reporter_id, 
            reporter_name,
            reason, 
            description, 
            evidence,
            priority 
        } = data;
        
        const [result] = await db.query(
            `INSERT INTO reports 
            (reported_user_id, reported_user_name, reporter_id, reporter_name, reason, description, evidence, priority, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [reported_user_id, reported_user_name, reporter_id, reporter_name, reason, description, evidence || null, priority || 'medium']
        );
        
        return await this.getById(result.insertId);
    }

    // Obtener reporte por ID
    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM reports WHERE id = ?', [id]);
        return rows[0] || null;
    }

    // Obtener todos los reportes
    static async getAll(filters = {}) {
        let query = 'SELECT * FROM reports WHERE 1=1';
        const params = [];

        if (filters.status) {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        if (filters.priority) {
            query += ' AND priority = ?';
            params.push(filters.priority);
        }

        if (filters.reporter_id) {
            query += ' AND reporter_id = ?';
            params.push(filters.reporter_id);
        }

        if (filters.search) {
            query += ' AND (reported_user_name LIKE ? OR reason LIKE ? OR description LIKE ?)';
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        query += ' ORDER BY created_at DESC';

        if (filters.limit) {
            query += ' LIMIT ?';
            params.push(parseInt(filters.limit));
        }

        const [rows] = await db.query(query, params);
        return rows;
    }

    // Actualizar estado
    static async updateStatus(id, status, handledBy, resolution) {
        await db.query(
            `UPDATE reports 
             SET status = ?, handled_by = ?, resolution = ?, handled_at = NOW() 
             WHERE id = ?`,
            [status, handledBy, resolution || null, id]
        );
        return await this.getById(id);
    }

    // Eliminar reporte
    static async delete(id) {
        await db.query('DELETE FROM reports WHERE id = ?', [id]);
        return true;
    }

    // Estadísticas de reportes
    static async getStats() {
        const [stats] = await db.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'reviewing' THEN 1 ELSE 0 END) as reviewing,
                SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
                SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
                SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high_priority,
                SUM(CASE WHEN priority = 'critical' THEN 1 ELSE 0 END) as critical_priority
            FROM reports
        `);
        return stats[0];
    }

    // Reportes recientes
    static async getRecent(limit = 10) {
        const [rows] = await db.query(
            'SELECT * FROM reports ORDER BY created_at DESC LIMIT ?',
            [limit]
        );
        return rows;
    }

    // Reportes por usuario reportado
    static async getByReportedUser(userId) {
        const [rows] = await db.query(
            'SELECT * FROM reports WHERE reported_user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        return rows;
    }

    // Asignar reporte a staff
    static async assign(id, staffId) {
        await db.query(
            'UPDATE reports SET assigned_to = ?, status = "reviewing" WHERE id = ?',
            [staffId, id]
        );
        return await this.getById(id);
    }
}

module.exports = Report;
