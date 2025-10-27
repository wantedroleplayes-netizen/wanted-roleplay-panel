-- Base de datos para Wanted Roleplay Staff Panel
-- Fecha de creación: 26 de Octubre de 2025

CREATE DATABASE IF NOT EXISTS wanted_roleplay;
USE wanted_roleplay;

-- Tabla de usuarios (staff members)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    discord_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL,
    discriminator VARCHAR(10),
    avatar VARCHAR(255),
    role_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_discord_id (discord_id),
    INDEX idx_is_active (is_active)
);

-- Tabla de baneos
CREATE TABLE IF NOT EXISTS bans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_name VARCHAR(255) NOT NULL,
    player_id VARCHAR(255),
    reason TEXT NOT NULL,
    duration VARCHAR(100),
    banned_by INT NOT NULL,
    banned_by_name VARCHAR(255) NOT NULL,
    evidence_url TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (banned_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_player_id (player_id),
    INDEX idx_created_at (created_at),
    INDEX idx_is_active (is_active)
);

-- Tabla de jail (encarcelamientos temporales)
CREATE TABLE IF NOT EXISTS jail (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_name VARCHAR(255) NOT NULL,
    player_id VARCHAR(255),
    reason TEXT NOT NULL,
    duration VARCHAR(100) NOT NULL,
    jailed_by INT NOT NULL,
    jailed_by_name VARCHAR(255) NOT NULL,
    evidence_url TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    released_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (jailed_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_player_id (player_id),
    INDEX idx_created_at (created_at),
    INDEX idx_is_active (is_active)
);

-- Tabla de hackers reportados
CREATE TABLE IF NOT EXISTS hackers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_name VARCHAR(255) NOT NULL,
    player_id VARCHAR(255),
    hack_type VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    evidence_url TEXT,
    reported_by INT NOT NULL,
    reported_by_name VARCHAR(255) NOT NULL,
    action_taken VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_resolved BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_player_id (player_id),
    INDEX idx_created_at (created_at),
    INDEX idx_is_resolved (is_resolved)
);

-- Tabla de devoluciones
CREATE TABLE IF NOT EXISTS refunds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_name VARCHAR(255) NOT NULL,
    player_id VARCHAR(255),
    item_description TEXT NOT NULL,
    reason TEXT NOT NULL,
    amount VARCHAR(100),
    processed_by INT NOT NULL,
    processed_by_name VARCHAR(255) NOT NULL,
    evidence_url TEXT,
    notes TEXT,
    status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_player_id (player_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Tabla de donaciones
CREATE TABLE IF NOT EXISTS donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_name VARCHAR(255) NOT NULL,
    player_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_method VARCHAR(100),
    transaction_id VARCHAR(255),
    package_name VARCHAR(255),
    status ENUM('pending', 'completed', 'refunded', 'cancelled') DEFAULT 'pending',
    registered_by INT NOT NULL,
    registered_by_name VARCHAR(255) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (registered_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_player_id (player_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Tabla de chat interno
CREATE TABLE IF NOT EXISTS chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    username VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_created_at (created_at),
    INDEX idx_user_id (user_id)
);

-- Tabla de logs de actividad
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    username VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    table_name VARCHAR(100),
    record_id INT,
    description TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_action (action)
);

-- Tabla de sesiones
CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(128) PRIMARY KEY,
    expires INT UNSIGNED NOT NULL,
    data MEDIUMTEXT,
    INDEX idx_expires (expires)
);

-- Insertar usuario administrador por defecto (opcional)
-- Nota: Actualizar con los datos reales de Discord
-- INSERT INTO users (discord_id, username, discriminator, is_active) 
-- VALUES ('YOUR_DISCORD_ID', 'Admin', '0001', TRUE);