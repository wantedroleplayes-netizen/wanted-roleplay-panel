// ==========================================
// DISCORD USER CHECKER - Verificación avanzada de usuarios
// ==========================================

class DiscordChecker {
    constructor() {
        this.knownHackServers = [
            // Servidores conocidos de venta de hacks (actualizar regularmente)
            { name: 'FiveM Cheats', keywords: ['cheat', 'hack', 'esp', 'aimbot', 'mod menu'] },
            { name: 'Mod Menus', keywords: ['mod menu', 'executor', 'injector'] },
            { name: 'FiveM Exploits', keywords: ['exploit', 'bypass', 'undetected'] }
        ];
        
        this.suspiciousRoles = [
            'buyer', 'customer', 'purchased', 'premium member', 'vip',
            'comprador', 'cliente', 'verificado', 'hack user', 'cheat user'
        ];
        
        this.init();
    }

    init() {
        console.log('✅ Discord Checker Pro inicializado');
        console.log('🔍 Sistema de detección avanzado activado');
    }

    /**
     * Verificar usuario de Discord por ID
     */
    async checkDiscordUser(userId) {
        try {
            Swal.fire({
                title: 'Buscando usuario...',
                html: 'Verificando información en Discord',
                allowOutsideClick: false,
                showConfirmButton: false,
                willOpen: () => {
                    Swal.showLoading();
                }
            });

            // Llamar a nuestra API interna
            const response = await fetch(`/api/discord/check/${userId}`);
            const data = await response.json();

            if (data.error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Usuario no encontrado',
                    text: data.error,
                    confirmButtonText: 'Entendido'
                });
                return;
            }

            // Mostrar información del usuario
            this.showUserInfo(data);

        } catch (error) {
            console.error('Error al verificar usuario:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo verificar el usuario. Intenta nuevamente.',
                confirmButtonText: 'OK'
            });
        }
    }

    /**
     * Mostrar información completa del usuario con análisis avanzado
     */
    showUserInfo(data) {
        const { user, total_servers, account_age_days, badges, risk_level, suspicious_servers, suspicious_roles, trust_score, stats } = data;

        // Determinar color del riesgo
        let riskColor = 'success';
        let riskIcon = '✅';
        if (risk_level === 'critical') {
            riskColor = 'danger';
            riskIcon = '🚨';
        } else if (risk_level === 'high') {
            riskColor = 'danger';
            riskIcon = '❌';
        } else if (risk_level === 'medium') {
            riskColor = 'warning';
            riskIcon = '⚠️';
        }

        // Calcular color del trust score
        const trustColor = trust_score >= 70 ? '#00ff88' : trust_score >= 40 ? '#ffaa00' : '#ff4444';
        const trustWidth = trust_score;

        const html = `
            <div style="text-align: left;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="${user.avatar_url}" 
                         style="width: 100px; height: 100px; border-radius: 50%; border: 3px solid ${trustColor}; margin-bottom: 10px; box-shadow: 0 0 20px ${trustColor}50;">
                    <h3 style="margin: 10px 0; color: ${trustColor};">${user.username}</h3>
                    ${user.display_name !== user.username ? `<p style="color: #e8e8e8; margin: 0;">Nombre: ${user.display_name}</p>` : ''}
                    
                    <!-- Trust Score Bar -->
                    <div style="margin-top: 15px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <strong>Trust Score:</strong>
                            <strong style="color: ${trustColor};">${trust_score}/100</strong>
                        </div>
                        <div style="width: 100%; height: 20px; background: #2a2a2a; border-radius: 10px; overflow: hidden; border: 1px solid #333;">
                            <div style="width: ${trustWidth}%; height: 100%; background: linear-gradient(90deg, ${trustColor}, ${trustColor}dd); transition: width 1s ease;"></div>
                        </div>
                        <p style="font-size: 0.85rem; color: #aaa; margin-top: 5px; text-align: center;">
                            ${trust_score >= 70 ? '✅ Usuario confiable' : trust_score >= 40 ? '⚠️ Revisar con precaución' : '❌ Alto riesgo - NO recomendado'}
                        </p>
                    </div>
                </div>

                <table style="width: 100%; margin-top: 20px;">
                    <tr>
                        <td><strong>ID de Discord:</strong></td>
                        <td><code style="background: #2a2a2a; padding: 4px 8px; border-radius: 4px;">${user.id}</code></td>
                    </tr>
                    <tr>
                        <td><strong>Fecha de creación:</strong></td>
                        <td>${user.created_at}</td>
                    </tr>
                    <tr>
                        <td><strong>Antigüedad:</strong></td>
                        <td>${account_age_days} días (${(account_age_days / 365).toFixed(1)} años)</td>
                    </tr>
                    <tr>
                        <td><strong>Total servidores:</strong></td>
                        <td><span class="modal-badge info">${total_servers} servidor(es)</span></td>
                    </tr>
                    ${suspicious_servers && suspicious_servers.length > 0 ? `
                        <tr>
                            <td><strong>Servidores sospechosos:</strong></td>
                            <td>
                                <span class="modal-badge danger">${suspicious_servers.length}</span>
                                ${stats && stats.critical_servers > 0 ? `<span class="modal-badge danger">🚨 ${stats.critical_servers} CRÍTICO(S)</span>` : ''}
                            </td>
                        </tr>
                    ` : ''}
                    <tr>
                        <td><strong>Es bot:</strong></td>
                        <td>${user.bot ? '🤖 Sí' : '👤 No'}</td>
                    </tr>
                    <tr>
                        <td><strong>Nivel de riesgo:</strong></td>
                        <td><span class="modal-badge ${riskColor}">${riskIcon} ${risk_level.toUpperCase()}</span></td>
                    </tr>
                </table>

                <!-- ANALYSTIC API DATA -->
                ${data.analystic && data.analystic.is_cheat_customer ? `
                    <div style="margin-top: 20px; padding: 15px; background: rgba(255, 0, 0, 0.2); border: 3px solid #ff0000; border-radius: 8px; animation: pulse 2s infinite;">
                        <h3 style="color: #ff0000; margin: 0 0 15px 0; text-align: center;">
                            🚨🚨 ALERTA ANALYSTIC 🚨🚨
                        </h3>
                        <div style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 5px;">
                            <p style="margin: 0 0 10px 0; font-size: 1.1rem; font-weight: 600; color: #ff4444;">
                                ⛔ CLIENTE CONFIRMADO DE CHEATS
                            </p>
                            <p style="margin: 0 0 15px 0; color: #e8e8e8;">
                                Este usuario ha sido identificado como comprador/usuario de los siguientes software de cheats:
                            </p>
                            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 15px;">
                                ${data.analystic.cheat_software.map(software => `
                                    <span style="background: #ff0000; color: white; padding: 8px 15px; border-radius: 20px; font-weight: 600;">
                                        💀 ${software}
                                    </span>
                                `).join('')}
                            </div>
                            <p style="margin: 0; color: #ff4444; font-weight: 600; font-size: 1.05rem; text-align: center;">
                                🚫 RECOMENDACIÓN: RECHAZAR Y BANEAR INMEDIATAMENTE
                            </p>
                        </div>
                    </div>
                ` : data.analystic && data.analystic.user_data ? `
                    <div style="margin-top: 20px; padding: 15px; background: rgba(0, 255, 136, 0.1); border: 2px solid #00ff88; border-radius: 8px;">
                        <h4 style="color: #00ff88; margin: 0 0 10px 0;">
                            ✅ Analystic: Sin registros de cheats
                        </h4>
                        <p style="margin: 0; color: #e8e8e8; font-size: 0.95rem;">
                            No se encontraron registros de compra o uso de software de cheats en la base de datos de Analystic.
                        </p>
                        ${data.analystic.has_steam || data.analystic.has_license ? `
                            <div style="margin-top: 10px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 5px;">
                                <strong style="color: #00ff88; font-size: 0.9rem;">Identificadores encontrados:</strong>
                                <ul style="margin: 5px 0 0 20px; font-size: 0.85rem; color: #e8e8e8;">
                                    ${data.analystic.has_steam ? '<li>Steam ✓</li>' : ''}
                                    ${data.analystic.has_license ? '<li>License ✓</li>' : ''}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}

                ${suspicious_servers && suspicious_servers.length > 0 ? `
                    <div style="margin-top: 20px; padding: 15px; background: rgba(255, 68, 68, 0.15); border: 2px solid #ff4444; border-radius: 8px;">
                        <h4 style="color: #ff4444; margin: 0 0 10px 0;">
                            ${stats && stats.critical_servers > 0 ? '🚨 ALERTA MÁXIMA: SERVIDORES DE HACKS CONFIRMADOS' : '🚨 SERVIDORES SOSPECHOSOS DETECTADOS'}
                        </h4>
                        <p style="margin: 0 0 10px 0;">Este usuario está en <strong>${suspicious_servers.length}</strong> servidor(es) relacionado(s) con HACKS de FiveM:</p>
                        <ul style="margin: 10px 0; padding-left: 20px; max-height: 200px; overflow-y: auto;">
                            ${suspicious_servers.map(s => `
                                <li style="margin: 8px 0;">
                                    <strong style="color: ${s.risk === 'CRITICAL' ? '#ff4444' : s.risk === 'HIGH' ? '#ff6666' : '#ffaa00'};">
                                        ${s.risk === 'CRITICAL' ? '🚨' : s.risk === 'HIGH' ? '⚠️' : '⚡'} ${s.name}
                                    </strong> (${s.member_count} miembros)
                                    <br><span style="font-size: 0.85rem; color: #ffaa00;">${s.reason}</span>
                                    ${s.risk === 'CRITICAL' ? '<br><span style="font-size: 0.85rem; color: #ff4444; font-weight: 600;">⚠️ SERVIDOR CONFIRMADO DE HACKS</span>' : ''}
                                </li>
                            `).join('')}
                        </ul>
                        <p style="margin: 10px 0 0 0; color: #ff4444; font-weight: 600; font-size: 1.1rem;">
                            ${stats && stats.critical_servers > 0 ? '🚨 RECHAZAR INMEDIATAMENTE - Usuario confirmado en servidores de hacks' : '⚠️ NO SE RECOMIENDA ACEPTAR A ESTE USUARIO'}
                        </p>
                    </div>
                ` : `
                    <div style="margin-top: 20px; padding: 15px; background: rgba(0, 255, 136, 0.1); border: 2px solid #00ff88; border-radius: 8px;">
                        <h4 style="color: #00ff88; margin: 0 0 10px 0;">✅ VERIFICACIÓN LIMPIA</h4>
                        <p style="margin: 0; color: #e8e8e8;">
                            No se detectaron servidores de hacks o cheats de FiveM.
                        </p>
                    </div>
                `}

                ${suspicious_roles && suspicious_roles.length > 0 ? `
                    <div style="margin-top: 15px; padding: 15px; background: rgba(255, 170, 0, 0.15); border: 2px solid #ffaa00; border-radius: 8px;">
                        <h4 style="color: #ffaa00; margin: 0 0 10px 0;">
                            ${stats && stats.buyer_roles > 0 ? '💳 ROLES DE COMPRADOR DETECTADOS' : '⚠️ ROLES SOSPECHOSOS DETECTADOS'}
                        </h4>
                        <p style="margin: 0 0 10px 0;">
                            ${stats && stats.buyer_roles > 0 
                                ? `Tiene <strong>${stats.buyer_roles}</strong> rol(es) que indican COMPRA de cheats:`
                                : 'Roles que podrían indicar compra de cheats:'}
                        </p>
                        <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                            ${suspicious_roles.map(role => `
                                <span class="modal-badge ${role.server_suspicious ? 'danger' : 'warning'}" 
                                      title="${role.server} - ${role.reason}">
                                    ${role.server_suspicious ? '🚨' : '⚠️'} ${role.name}
                                </span>
                            `).join('')}
                        </div>
                        ${stats && stats.buyer_roles > 0 ? `
                            <p style="margin: 10px 0 0 0; color: #ff4444; font-size: 0.9rem;">
                                ⚠️ Usuario tiene roles de comprador en servidores de hacks
                            </p>
                        ` : ''}
                    </div>
                ` : ''}

                ${data.warnings && data.warnings.length > 0 ? `
                    <div style="margin-top: 20px; padding: 15px; background: rgba(255, 68, 68, 0.1); border: 1px solid #ff4444; border-radius: 8px;">
                        <strong style="color: #ff4444;">⚠️ Advertencias:</strong>
                        <ul style="margin: 10px 0 0 20px;">
                            ${data.warnings.map(w => `<li>${w}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${badges.length > 0 ? `
                    <div style="margin-top: 20px;">
                        <strong>Insignias:</strong><br>
                        ${badges.map(badge => `<span class="modal-badge info">${badge}</span>`).join(' ')}
                    </div>
                ` : ''}

                ${user.banner_url ? `
                    <div style="margin-top: 20px;">
                        <strong>Banner:</strong><br>
                        <img src="${user.banner_url}" style="width: 100%; border-radius: 8px; margin-top: 10px;">
                    </div>
                ` : ''}
                
                <!-- Acciones rápidas -->
                <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #333;">
                    <strong style="display: block; margin-bottom: 10px;">⚡ Acciones rápidas:</strong>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <button onclick="addToBlacklist('${user.id}', '${user.username}')" class="swal2-confirm swal2-styled" style="margin: 0;">
                            🚫 Blacklist
                        </button>
                        <button onclick="addNote('${user.id}', '${user.username}')" class="swal2-confirm swal2-styled" style="margin: 0; background: #9b59b6 !important;">
                            📝 Agregar Nota
                        </button>
                    </div>
                </div>
            </div>
        `;

        const buttonText = suspicious_servers && suspicious_servers.length > 0 ? '🚫 Agregar a Blacklist' : '📋 Copiar ID';
        const buttonColor = suspicious_servers && suspicious_servers.length > 0 ? 'danger' : 'success';

        Swal.fire({
            title: `Información de Discord`,
            html: html,
            width: '700px',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: buttonText,
            cancelButtonText: 'Cerrar',
            customClass: {
                popup: risk_level === 'high' || (suspicious_servers && suspicious_servers.length > 0) ? 'danger-modal animate-pulse' : ''
            }
        }).then((result) => {
            if (result.isConfirmed) {
                if (suspicious_servers && suspicious_servers.length > 0) {
                    addToBlacklist(user.id, user.username);
                } else {
                    navigator.clipboard.writeText(user.id);
                    showNotification('ID copiado al portapapeles', 'success');
                }
            }
        });
    }

    /**
     * Mostrar modal de entrada para verificar usuario
     */
    async promptCheckUser() {
        const { value: userId } = await Swal.fire({
            title: '🔍 Verificar Usuario de Discord',
            html: `
                <p style="color: #e8e8e8; margin-bottom: 20px;">
                    Introduce el ID de Discord del usuario que deseas verificar.
                </p>
                <p style="color: #ffaa00; font-size: 0.9rem;">
                    💡 Para obtener el ID, activa el Modo Desarrollador en Discord y haz clic derecho en el usuario.
                </p>
            `,
            input: 'text',
            inputPlaceholder: 'ID de Discord (ej: 123456789012345678)',
            showCancelButton: true,
            confirmButtonText: 'Verificar',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value) {
                    return 'Por favor introduce un ID';
                }
                if (!/^\d{17,19}$/.test(value)) {
                    return 'El ID debe tener entre 17 y 19 dígitos';
                }
            }
        });

        if (userId) {
            this.checkDiscordUser(userId);
        }
    }

    /**
     * Verificar si un usuario está en servidores de hacks conocidos
     */
    async checkHackServers(userId) {
        try {
            const response = await fetch(`/api/discord/check-hack-servers/${userId}`);
            const data = await response.json();

            if (data.is_in_hack_servers) {
                Swal.fire({
                    icon: 'warning',
                    title: '⚠️ Usuario Sospechoso',
                    html: `
                        <p>Este usuario está en <strong>${data.hack_servers.length}</strong> servidor(es) relacionado(s) con hacks:</p>
                        <ul style="text-align: left; margin-top: 15px;">
                            ${data.hack_servers.map(s => `<li><strong>${s.name}</strong> (${s.member_count} miembros)</li>`).join('')}
                        </ul>
                        <p style="color: #ff4444; margin-top: 15px;">
                            ⚠️ Se recomienda precaución con este usuario
                        </p>
                    `,
                    confirmButtonText: 'Entendido',
                    customClass: {
                        popup: 'danger-modal'
                    }
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: '✅ Usuario Verificado',
                    text: 'Este usuario no está en ningún servidor conocido de hacks.',
                    confirmButtonText: 'Perfecto'
                });
            }

        } catch (error) {
            console.error('Error al verificar servidores de hack:', error);
        }
    }
}

// Instancia global
const discordChecker = new DiscordChecker();

// Función global para verificar usuario
function checkDiscordUser() {
    discordChecker.promptCheckUser();
}

// ==========================================
// SISTEMA DE BLACKLIST
// ==========================================

async function addToBlacklist(userId, username) {
    const { value: reason } = await Swal.fire({
        title: '🚫 Agregar a Blacklist',
        html: `
            <p style="margin-bottom: 15px;">Usuario: <strong>${username}</strong></p>
            <p style="color: #ff4444; margin-bottom: 15px;">⚠️ Este usuario será bloqueado del servidor</p>
        `,
        input: 'textarea',
        inputLabel: 'Motivo del bloqueo',
        inputPlaceholder: 'Describe por qué este usuario está siendo bloqueado...',
        showCancelButton: true,
        confirmButtonText: 'Agregar a Blacklist',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return 'Debes proporcionar un motivo';
            }
        }
    });

    if (reason) {
        try {
            const response = await fetch('/api/blacklist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    discord_id: userId,
                    username: username,
                    reason: reason
                })
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: '✅ Usuario bloqueado',
                    text: `${username} ha sido agregado a la blacklist`,
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                throw new Error(data.error || 'Error al agregar a blacklist');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message
            });
        }
    }
}

async function addNote(userId, username) {
    const { value: note } = await Swal.fire({
        title: '📝 Agregar Nota',
        html: `<p style="margin-bottom: 15px;">Usuario: <strong>${username}</strong></p>`,
        input: 'textarea',
        inputLabel: 'Nota sobre el usuario',
        inputPlaceholder: 'Agrega información relevante sobre este usuario...',
        showCancelButton: true,
        confirmButtonText: 'Guardar Nota',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return 'La nota no puede estar vacía';
            }
        }
    });

    if (note) {
        try {
            const response = await fetch('/api/user-notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    discord_id: userId,
                    username: username,
                    note: note
                })
            });

            const data = await response.json();

            if (data.success) {
                showNotification('Nota guardada correctamente', 'success');
            } else {
                throw new Error(data.error || 'Error al guardar nota');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message
            });
        }
    }
}

// ==========================================
// GESTIÓN DE WHITELIST
// ==========================================

async function manageWhitelist() {
    const { value: action } = await Swal.fire({
        title: '📋 Gestión de Whitelist',
        html: `
            <div style="text-align: left;">
                <p style="margin-bottom: 20px; color: #e8e8e8;">
                    Selecciona una acción para gestionar la whitelist del servidor:
                </p>
            </div>
        `,
        input: 'select',
        inputOptions: {
            'add': '➕ Agregar usuario a whitelist',
            'remove': '➖ Remover de whitelist',
            'view': '👁️ Ver usuarios en whitelist',
            'check': '🔍 Verificar si un usuario está en whitelist'
        },
        inputPlaceholder: 'Selecciona una acción',
        showCancelButton: true,
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return 'Debes seleccionar una acción';
            }
        }
    });

    if (action === 'add') {
        await addToWhitelist();
    } else if (action === 'remove') {
        await removeFromWhitelist();
    } else if (action === 'view') {
        await viewWhitelist();
    } else if (action === 'check') {
        await checkWhitelist();
    }
}

async function addToWhitelist() {
    const { value: userId } = await Swal.fire({
        title: '➕ Agregar a Whitelist',
        input: 'text',
        inputLabel: 'ID de Discord del usuario',
        inputPlaceholder: '123456789012345678',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) return 'Introduce un ID';
            if (!/^\d{17,19}$/.test(value)) return 'ID inválido';
        }
    });

    if (userId) {
        try {
            const response = await fetch('/api/whitelist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ discord_id: userId })
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: '✅ Usuario agregado',
                    text: 'El usuario ha sido agregado a la whitelist',
                    timer: 2000
                });
            }
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    }
}

async function removeFromWhitelist() {
    const { value: userId } = await Swal.fire({
        title: '➖ Remover de Whitelist',
        input: 'text',
        inputLabel: 'ID de Discord del usuario',
        inputPlaceholder: '123456789012345678',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) return 'Introduce un ID';
            if (!/^\d{17,19}$/.test(value)) return 'ID inválido';
        }
    });

    if (userId) {
        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Este usuario será removido de la whitelist',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, remover',
            cancelButtonText: 'Cancelar'
        });

        if (confirm.isConfirmed) {
            try {
                const response = await fetch(`/api/whitelist/${userId}`, {
                    method: 'DELETE'
                });

                const data = await response.json();

                if (data.success) {
                    Swal.fire('Removido', 'Usuario removido de la whitelist', 'success');
                }
            } catch (error) {
                Swal.fire('Error', error.message, 'error');
            }
        }
    }
}

async function viewWhitelist() {
    try {
        const response = await fetch('/api/whitelist');
        const data = await response.json();

        if (data.whitelist && data.whitelist.length > 0) {
            const html = `
                <div style="max-height: 400px; overflow-y: auto;">
                    <table style="width: 100%; text-align: left;">
                        <thead>
                            <tr style="border-bottom: 2px solid #333;">
                                <th style="padding: 10px;">Usuario</th>
                                <th style="padding: 10px;">Agregado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.whitelist.map(user => `
                                <tr style="border-bottom: 1px solid #333;">
                                    <td style="padding: 10px;">${user.username || user.discord_id}</td>
                                    <td style="padding: 10px;">${new Date(user.created_at).toLocaleDateString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;

            Swal.fire({
                title: `👥 Whitelist (${data.whitelist.length} usuarios)`,
                html: html,
                width: '600px',
                confirmButtonText: 'Cerrar'
            });
        } else {
            Swal.fire('Whitelist vacía', 'No hay usuarios en la whitelist', 'info');
        }
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    }
}

async function checkWhitelist() {
    const { value: userId } = await Swal.fire({
        title: '🔍 Verificar Whitelist',
        input: 'text',
        inputLabel: 'ID de Discord',
        inputPlaceholder: '123456789012345678',
        showCancelButton: true
    });

    if (userId) {
        try {
            const response = await fetch(`/api/whitelist/check/${userId}`);
            const data = await response.json();

            Swal.fire({
                icon: data.is_whitelisted ? 'success' : 'error',
                title: data.is_whitelisted ? '✅ En Whitelist' : '❌ No está en Whitelist',
                text: data.is_whitelisted ? 'Este usuario tiene acceso' : 'Este usuario NO tiene acceso'
            });
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    }
}
