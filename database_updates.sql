-- ==========================================
-- TABLAS ADICIONALES PARA GESTIÓN DE SERVIDOR
-- ==========================================

-- Tabla de Blacklist (usuarios bloqueados)
CREATE TABLE IF NOT EXISTS blacklist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    discord_id VARCHAR(20) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL,
    reason TEXT NOT NULL,
    added_by INT NOT NULL,
    added_by_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_discord_id (discord_id),
    INDEX idx_added_by (added_by),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Whitelist (usuarios autorizados)
CREATE TABLE IF NOT EXISTS whitelist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    discord_id VARCHAR(20) NOT NULL UNIQUE,
    username VARCHAR(100),
    added_by INT NOT NULL,
    added_by_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_discord_id (discord_id),
    INDEX idx_added_by (added_by),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Notas de Usuarios
CREATE TABLE IF NOT EXISTS user_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    discord_id VARCHAR(20) NOT NULL,
    username VARCHAR(100) NOT NULL,
    note TEXT NOT NULL,
    created_by INT NOT NULL,
    created_by_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_discord_id (discord_id),
    INDEX idx_created_by (created_by),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- INSERTS DE EJEMPLO (OPCIONAL)
-- ==========================================

-- Ejemplos para testing (comentados por defecto)
/*
INSERT INTO blacklist (discord_id, username, reason, added_by, added_by_name) 
VALUES ('123456789012345678', 'HackerExample', 'Detectado en servidores de hacks', 1, 'Admin');

INSERT INTO whitelist (discord_id, username, added_by, added_by_name) 
VALUES ('987654321098765432', 'TrustedPlayer', 1, 'Admin');

INSERT INTO user_notes (discord_id, username, note, created_by, created_by_name) 
VALUES ('123456789012345678', 'TestUser', 'Usuario verificado manualmente - cuenta limpia', 1, 'Admin');
*/

-- ==========================================
-- ÍNDICES ADICIONALES PARA MEJOR RENDIMIENTO
-- ==========================================

-- Índices compuestos para búsquedas frecuentes
CREATE INDEX idx_blacklist_search ON blacklist(username, discord_id);
CREATE INDEX idx_whitelist_search ON whitelist(username, discord_id);
CREATE INDEX idx_notes_search ON user_notes(username, discord_id, note(100));

-- ==========================================
-- VERIFICACIÓN DE TABLAS
-- ==========================================

-- Muestra todas las tablas creadas
SHOW TABLES;

-- Muestra la estructura de cada tabla
DESCRIBE blacklist;
DESCRIBE whitelist;
DESCRIBE user_notes;

-- Cuenta de registros en cada tabla
SELECT 'blacklist' as tabla, COUNT(*) as registros FROM blacklist
UNION ALL
SELECT 'whitelist' as tabla, COUNT(*) as registros FROM whitelist
UNION ALL
SELECT 'user_notes' as tabla, COUNT(*) as registros FROM user_notes;
