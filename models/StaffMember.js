const db = require('../config/database');

class StaffMember {
    // Crear miembro del staff
    static async create(data) {
        const { discord_id, username, role, permissions, added_by } = data;
        
        const [result] = await db.query(
            `INSERT INTO staff_members 
            (discord_id, username, role, permissions, added_by, status) 
            VALUES (?, ?, ?, ?, ?, 'active')`,
            [discord_id, username, role, permissions || '[]', added_by]
        );
        
        return await this.getById(result.insertId);
    }

    // Obtener por ID
    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM staff_members WHERE id = ?', [id]);
        return rows[0] || null;
    }

    // Obtener por Discord ID
    static async getByDiscordId(discordId) {
        const [rows] = await db.query('SELECT * FROM staff_members WHERE discord_id = ?', [discordId]);
        return rows[0] || null;
    }

    // Obtener todos los staff
    static async getAll(filters = {}) {
        let query = 'SELECT * FROM staff_members WHERE 1=1';
        const params = [];

        if (filters.role) {
            query += ' AND role = ?';
            params.push(filters.role);
        }

        if (filters.status) {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        if (filters.search) {
            query += ' AND username LIKE ?';
            params.push(`%${filters.search}%`);
        }

        query += ' ORDER BY created_at DESC';

        const [rows] = await db.query(query, params);
        return rows;
    }

    // Actualizar rol
    static async updateRole(id, role, updatedBy) {
        await db.query(
            'UPDATE staff_members SET role = ?, updated_at = NOW() WHERE id = ?',
            [role, id]
        );
        
        // Log de actividad
        await db.query(
            'INSERT INTO activity_logs (action, details, user_id) VALUES (?, ?, ?)',
            ['staff_role_update', `Rol actualizado a: ${role}`, updatedBy]
        );
        
        return await this.getById(id);
    }

    // Actualizar permisos
    static async updatePermissions(id, permissions, updatedBy) {
        const permissionsJson = JSON.stringify(permissions);
        
        await db.query(
            'UPDATE staff_members SET permissions = ?, updated_at = NOW() WHERE id = ?',
            [permissionsJson, id]
        );
        
        return await this.getById(id);
    }

    // Cambiar estado (activo/inactivo/suspendido)
    static async updateStatus(id, status, reason, updatedBy) {
        await db.query(
            'UPDATE staff_members SET status = ?, updated_at = NOW() WHERE id = ?',
            [status, id]
        );
        
        await db.query(
            'INSERT INTO activity_logs (action, details, user_id) VALUES (?, ?, ?)',
            ['staff_status_update', `Estado cambiado a: ${status}. Razón: ${reason}`, updatedBy]
        );
        
        return await this.getById(id);
    }

    // Eliminar staff
    static async delete(id) {
        await db.query('DELETE FROM staff_members WHERE id = ?', [id]);
        return true;
    }

    // Verificar si tiene permiso
    static async hasPermission(discordId, permission) {
        const staff = await this.getByDiscordId(discordId);
        if (!staff || staff.status !== 'active') return false;
        
        try {
            const permissions = JSON.parse(staff.permissions || '[]');
            return permissions.includes(permission) || permissions.includes('*');
        } catch {
            return false;
        }
    }

    // Estadísticas del staff
    static async getStats() {
        const [stats] = await db.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive,
                SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspended,
                SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins,
                SUM(CASE WHEN role = 'moderator' THEN 1 ELSE 0 END) as moderators,
                SUM(CASE WHEN role = 'support' THEN 1 ELSE 0 END) as support
            FROM staff_members
        `);
        return stats[0];
    }

    // Actividad reciente del staff
    static async getActivityByStaff(discordId, limit = 50) {
        const [rows] = await db.query(
            'SELECT * FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
            [discordId, limit]
        );
        return rows;
    }
}

module.exports = StaffMember;
