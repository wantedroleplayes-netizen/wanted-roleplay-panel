const db = require('../config/database');

class Settings {
    // Obtener todas las configuraciones
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM settings ORDER BY category, setting_key');
        return rows;
    }

    // Obtener configuración por clave
    static async get(key) {
        const [rows] = await db.query('SELECT * FROM settings WHERE setting_key = ?', [key]);
        return rows[0] || null;
    }

    // Obtener configuraciones por categoría
    static async getByCategory(category) {
        const [rows] = await db.query('SELECT * FROM settings WHERE category = ? ORDER BY setting_key', [category]);
        return rows;
    }

    // Actualizar configuración
    static async update(key, value, updatedBy) {
        await db.query(
            'UPDATE settings SET value = ?, updated_by = ?, updated_at = NOW() WHERE setting_key = ?',
            [value, updatedBy, key]
        );
        return await this.get(key);
    }

    // Crear nueva configuración
    static async create(data) {
        const { setting_key, category, value, description, type, created_by } = data;
        
        const [result] = await db.query(
            `INSERT INTO settings (setting_key, category, value, description, type, created_by) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [setting_key, category, value, description, type || 'text', created_by]
        );
        
        return await this.get(setting_key);
    }

    // Eliminar configuración
    static async delete(key) {
        await db.query('DELETE FROM settings WHERE setting_key = ?', [key]);
        return true;
    }

    // Obtener valor como objeto JSON
    static async getJson(key) {
        const setting = await this.get(key);
        if (!setting) return null;
        
        try {
            return JSON.parse(setting.value);
        } catch {
            return setting.value;
        }
    }

    // Guardar objeto JSON
    static async setJson(key, obj, updatedBy) {
        const value = JSON.stringify(obj);
        return await this.update(key, value, updatedBy);
    }

    // Obtener valor booleano
    static async getBoolean(key) {
        const setting = await this.get(key);
        if (!setting) return false;
        return setting.value === 'true' || setting.value === '1';
    }

    // Obtener todas las configuraciones como objeto
    static async getAllAsObject() {
        const settings = await this.getAll();
        const obj = {};
        
        for (const setting of settings) {
            if (!obj[setting.category]) {
                obj[setting.category] = {};
            }
            
            // Intentar parsear JSON
            let value = setting.value;
            try {
                value = JSON.parse(value);
            } catch {
                // Mantener como string
            }
            
            obj[setting.category][setting.setting_key] = {
                value: value,
                description: setting.description,
                type: setting.type
            };
        }
        
        return obj;
    }
}

module.exports = Settings;
