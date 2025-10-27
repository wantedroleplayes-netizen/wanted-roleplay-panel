-- =============================================
-- MEJORAS MASIVAS - NUEVAS TABLAS
-- =============================================

-- Tabla de configuraciones del sistema
CREATE TABLE IF NOT EXISTS `settings` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `setting_key` VARCHAR(100) UNIQUE NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `value` TEXT,
    `description` VARCHAR(255),
    `type` ENUM('text', 'number', 'boolean', 'json') DEFAULT 'text',
    `created_by` VARCHAR(255),
    `updated_by` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_category` (`category`),
    INDEX `idx_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de reportes
CREATE TABLE IF NOT EXISTS `reports` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `reported_user_id` VARCHAR(255) NOT NULL,
    `reported_user_name` VARCHAR(255) NOT NULL,
    `reporter_id` VARCHAR(255) NOT NULL,
    `reporter_name` VARCHAR(255) NOT NULL,
    `reason` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `evidence` TEXT,
    `priority` ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    `status` ENUM('pending', 'reviewing', 'resolved', 'rejected') DEFAULT 'pending',
    `assigned_to` VARCHAR(255),
    `handled_by` VARCHAR(255),
    `resolution` TEXT,
    `handled_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_reporter` (`reporter_id`),
    INDEX `idx_reported` (`reported_user_id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_priority` (`priority`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de miembros del staff
CREATE TABLE IF NOT EXISTS `staff_members` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `discord_id` VARCHAR(255) UNIQUE NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'moderator', 'support', 'helper') NOT NULL,
    `permissions` JSON,
    `status` ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    `added_by` VARCHAR(255),
    `last_activity` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_discord_id` (`discord_id`),
    INDEX `idx_role` (`role`),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS `notifications` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT,
    `type` ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
    `icon` VARCHAR(50),
    `link` VARCHAR(500),
    `is_read` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_is_read` (`is_read`),
    INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de tareas pendientes
CREATE TABLE IF NOT EXISTS `tasks` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `assigned_to` VARCHAR(255),
    `created_by` VARCHAR(255) NOT NULL,
    `priority` ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    `status` ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    `due_date` TIMESTAMP NULL,
    `completed_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_assigned` (`assigned_to`),
    INDEX `idx_status` (`status`),
    INDEX `idx_priority` (`priority`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- DATOS INICIALES - CONFIGURACIONES POR DEFECTO
-- =============================================

INSERT INTO `settings` (`setting_key`, `category`, `value`, `description`, `type`) VALUES
('panel_name', 'general', 'Wanted Roleplay', 'Nombre del panel', 'text'),
('panel_theme', 'appearance', 'dark', 'Tema del panel (dark/light)', 'text'),
('enable_notifications', 'general', 'true', 'Activar notificaciones en tiempo real', 'boolean'),
('enable_discord_sync', 'discord', 'true', 'Sincronizar con Discord automáticamente', 'boolean'),
('webhook_enabled', 'webhooks', 'true', 'Activar webhooks de Discord', 'boolean'),
('max_bans_per_page', 'pagination', '25', 'Máximo de baneos por página', 'number'),
('session_timeout', 'security', '7200', 'Tiempo de sesión en segundos', 'number'),
('enable_2fa', 'security', 'false', 'Requerir autenticación de dos factores', 'boolean'),
('enable_ip_whitelist', 'security', 'false', 'Activar lista blanca de IPs', 'boolean'),
('enable_analytics', 'general', 'true', 'Activar analíticas del panel', 'boolean'),
('enable_auto_backup', 'general', 'true', 'Backups automáticos diarios', 'boolean'),
('discord_role_staff', 'discord', '1234567890', 'ID del rol de staff en Discord', 'text'),
('discord_role_admin', 'discord', '1234567891', 'ID del rol de admin en Discord', 'text'),
('language', 'general', 'es', 'Idioma del panel (es/en)', 'text'),
('timezone', 'general', 'Europe/Madrid', 'Zona horaria', 'text'),
('analystic_enabled', 'integrations', 'true', 'Activar integración con Analystic API', 'boolean'),
('trust_score_threshold', 'security', '40', 'Puntaje mínimo de confianza para aceptar', 'number'),
('auto_blacklist_cheaters', 'security', 'true', 'Blacklist automático de cheaters detectados', 'boolean'),
('enable_reports', 'general', 'true', 'Activar sistema de reportes', 'boolean'),
('require_evidence', 'reports', 'false', 'Requerir evidencia en reportes', 'boolean'),
('max_file_upload_size', 'general', '10485760', 'Tamaño máximo de archivos (bytes)', 'number')
ON DUPLICATE KEY UPDATE value = VALUES(value);

-- =============================================
-- MEJORAS A TABLAS EXISTENTES
-- =============================================

-- Agregar columnas a users si no existen
ALTER TABLE `users` 
ADD COLUMN IF NOT EXISTS `theme` VARCHAR(20) DEFAULT 'dark',
ADD COLUMN IF NOT EXISTS `language` VARCHAR(10) DEFAULT 'es',
ADD COLUMN IF NOT EXISTS `timezone` VARCHAR(50) DEFAULT 'Europe/Madrid',
ADD COLUMN IF NOT EXISTS `email_notifications` BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS `discord_notifications` BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS `last_seen` TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS `ip_address` VARCHAR(45),
ADD COLUMN IF NOT EXISTS `user_agent` TEXT,
ADD INDEX IF NOT EXISTS `idx_last_seen` (`last_seen`);

-- Agregar columnas a activity_logs si no existen
ALTER TABLE `activity_logs`
ADD COLUMN IF NOT EXISTS `ip_address` VARCHAR(45),
ADD COLUMN IF NOT EXISTS `user_agent` TEXT,
ADD COLUMN IF NOT EXISTS `severity` ENUM('low', 'medium', 'high', 'critical') DEFAULT 'low',
ADD INDEX IF NOT EXISTS `idx_severity` (`severity`);

-- =============================================
-- VISTAS ÚTILES
-- =============================================

-- Vista de estadísticas generales
CREATE OR REPLACE VIEW `stats_overview` AS
SELECT 
    (SELECT COUNT(*) FROM bans WHERE active = TRUE) as active_bans,
    (SELECT COUNT(*) FROM jails WHERE active = TRUE) as active_jails,
    (SELECT COUNT(*) FROM hackers) as total_hackers,
    (SELECT COUNT(*) FROM donations) as total_donations,
    (SELECT SUM(amount) FROM donations) as total_donated,
    (SELECT COUNT(*) FROM refunds) as total_refunds,
    (SELECT SUM(amount) FROM refunds) as total_refunded,
    (SELECT COUNT(*) FROM blacklist) as blacklisted_users,
    (SELECT COUNT(*) FROM whitelist) as whitelisted_users,
    (SELECT COUNT(*) FROM reports WHERE status = 'pending') as pending_reports,
    (SELECT COUNT(*) FROM staff_members WHERE status = 'active') as active_staff,
    (SELECT COUNT(*) FROM users) as total_users;

-- Vista de actividad reciente
CREATE OR REPLACE VIEW `recent_activity_view` AS
SELECT 
    id,
    action,
    details,
    user_id,
    created_at,
    ip_address,
    severity
FROM activity_logs
ORDER BY created_at DESC
LIMIT 100;

-- Vista de reportes pendientes críticos
CREATE OR REPLACE VIEW `critical_reports_view` AS
SELECT 
    r.*
FROM reports r
WHERE r.status IN ('pending', 'reviewing')
AND r.priority IN ('high', 'critical')
ORDER BY 
    FIELD(r.priority, 'critical', 'high'),
    r.created_at ASC;

COMMIT;
