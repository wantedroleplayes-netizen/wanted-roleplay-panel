// ==========================================
// GESTIÓN DE BLACKLIST
// ==========================================

let blacklistData = [];

// Cargar blacklist al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadBlacklist();
});

/**
 * Cargar todos los usuarios de la blacklist
 */
async function loadBlacklist() {
    try {
        const response = await fetch('/api/blacklist');
        const data = await response.json();
        
        blacklistData = data.blacklist || [];
        renderBlacklist(blacklistData);
    } catch (error) {
        console.error('Error al cargar blacklist:', error);
        document.getElementById('blacklistTable').innerHTML = '<p class="error">Error al cargar la blacklist</p>';
    }
}

/**
 * Renderizar tabla de blacklist
 */
function renderBlacklist(items) {
    const container = document.getElementById('blacklistTable');
    
    if (items.length === 0) {
        container.innerHTML = '<p class="empty-state">No hay usuarios en la blacklist</p>';
        return;
    }
    
    const html = `
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Discord ID</th>
                        <th>Motivo</th>
                        <th>Agregado por</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => `
                        <tr>
                            <td><strong>${item.username}</strong></td>
                            <td><code>${item.discord_id}</code></td>
                            <td class="truncate" title="${item.reason}">${item.reason}</td>
                            <td>${item.added_by_name}</td>
                            <td>${formatDate(item.created_at)}</td>
                            <td>
                                <button class="btn-icon" onclick="viewBlacklistDetails('${item.discord_id}')" title="Ver detalles">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn-icon danger" onclick="removeFromBlacklist('${item.discord_id}', '${item.username}')" title="Remover">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="stats-summary">
            <p><strong>${items.length}</strong> usuario(s) en blacklist</p>
        </div>
    `;
    
    container.innerHTML = html;
}

/**
 * Buscar en blacklist
 */
function searchBlacklist() {
    const searchTerm = document.getElementById('searchBlacklist').value.toLowerCase();
    
    if (!searchTerm) {
        renderBlacklist(blacklistData);
        return;
    }
    
    const filtered = blacklistData.filter(item => 
        item.username.toLowerCase().includes(searchTerm) ||
        item.discord_id.includes(searchTerm) ||
        item.reason.toLowerCase().includes(searchTerm)
    );
    
    renderBlacklist(filtered);
}

/**
 * Agregar usuario manualmente a blacklist
 */
async function addToBlacklistManual() {
    const { value: userId } = await Swal.fire({
        title: '🚫 Agregar a Blacklist',
        html: `
            <p style="color: #e8e8e8; margin-bottom: 15px;">
                Introduce el ID de Discord del usuario que deseas bloquear.
            </p>
        `,
        input: 'text',
        inputLabel: 'ID de Discord',
        inputPlaceholder: '123456789012345678',
        showCancelButton: true,
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return 'Introduce un ID de Discord';
            }
            if (!/^\d{17,19}$/.test(value)) {
                return 'El ID debe tener entre 17 y 19 dígitos';
            }
        }
    });
    
    if (userId) {
        // Intentar obtener información del usuario primero
        try {
            const response = await fetch(`/api/discord/check/${userId}`);
            const data = await response.json();
            
            if (data.user) {
                // Mostrar información y pedir confirmación
                const { value: reason } = await Swal.fire({
                    title: '🚫 Confirmar Bloqueo',
                    html: `
                        <div style="text-align: center; margin-bottom: 20px;">
                            <img src="${data.user.avatar_url}" 
                                 style="width: 80px; height: 80px; border-radius: 50%; border: 2px solid #ff4444; margin-bottom: 10px;">
                            <h3 style="margin: 10px 0;">${data.user.username}</h3>
                            <p style="color: #e8e8e8;">ID: <code>${data.user.id}</code></p>
                        </div>
                        <p style="color: #ff4444; margin-bottom: 15px;">
                            ⚠️ Este usuario será bloqueado permanentemente del servidor
                        </p>
                    `,
                    input: 'textarea',
                    inputLabel: 'Motivo del bloqueo',
                    inputPlaceholder: 'Describe el motivo del bloqueo...',
                    showCancelButton: true,
                    confirmButtonText: 'Bloquear Usuario',
                    cancelButtonText: 'Cancelar',
                    inputValidator: (value) => {
                        if (!value) {
                            return 'Debes proporcionar un motivo';
                        }
                    }
                });
                
                if (reason) {
                    await addToBlacklist(userId, data.user.username, reason);
                }
            }
        } catch (error) {
            // Si no se puede obtener info, pedir nombre y motivo manualmente
            const { value: formValues } = await Swal.fire({
                title: '🚫 Agregar a Blacklist',
                html: `
                    <p style="color: #ff4444; margin-bottom: 15px;">
                        No se pudo obtener información automática del usuario.
                    </p>
                    <input id="swal-input1" class="swal2-input" placeholder="Nombre de usuario">
                    <textarea id="swal-input2" class="swal2-textarea" placeholder="Motivo del bloqueo"></textarea>
                `,
                showCancelButton: true,
                confirmButtonText: 'Agregar',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    return {
                        username: document.getElementById('swal-input1').value,
                        reason: document.getElementById('swal-input2').value
                    };
                },
                inputValidator: (value) => {
                    if (!value.username || !value.reason) {
                        return 'Completa todos los campos';
                    }
                }
            });
            
            if (formValues) {
                await addToBlacklist(userId, formValues.username, formValues.reason);
            }
        }
    }
}

/**
 * Remover usuario de blacklist
 */
async function removeFromBlacklist(discordId, username) {
    const confirm = await Swal.fire({
        title: '¿Remover de blacklist?',
        html: `
            <p>¿Estás seguro de que deseas remover a <strong>${username}</strong> de la blacklist?</p>
            <p style="color: #ffaa00;">Este usuario podrá intentar acceder al servidor nuevamente.</p>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, remover',
        cancelButtonText: 'Cancelar'
    });
    
    if (confirm.isConfirmed) {
        try {
            const response = await fetch(`/api/blacklist/${discordId}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (data.success) {
                showNotification(`${username} removido de la blacklist`, 'success');
                loadBlacklist(); // Recargar lista
            } else {
                throw new Error(data.error || 'Error al remover');
            }
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    }
}

/**
 * Ver detalles de un usuario en blacklist
 */
async function viewBlacklistDetails(discordId) {
    const item = blacklistData.find(b => b.discord_id === discordId);
    
    if (!item) return;
    
    const html = `
        <div style="text-align: left;">
            <table style="width: 100%;">
                <tr>
                    <td><strong>Usuario:</strong></td>
                    <td>${item.username}</td>
                </tr>
                <tr>
                    <td><strong>Discord ID:</strong></td>
                    <td><code>${item.discord_id}</code></td>
                </tr>
                <tr>
                    <td><strong>Motivo:</strong></td>
                    <td>${item.reason}</td>
                </tr>
                <tr>
                    <td><strong>Agregado por:</strong></td>
                    <td>${item.added_by_name}</td>
                </tr>
                <tr>
                    <td><strong>Fecha:</strong></td>
                    <td>${formatDate(item.created_at)}</td>
                </tr>
            </table>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #333;">
                <button onclick="navigator.clipboard.writeText('${item.discord_id}'); showNotification('ID copiado', 'success')" class="swal2-confirm swal2-styled">
                    📋 Copiar Discord ID
                </button>
            </div>
        </div>
    `;
    
    Swal.fire({
        title: '🚫 Detalles de Blacklist',
        html: html,
        width: '600px',
        showCloseButton: true,
        showConfirmButton: false,
        customClass: {
            popup: 'danger-modal'
        }
    });
}

/**
 * Exportar blacklist a CSV
 */
function exportBlacklist() {
    if (blacklistData.length === 0) {
        Swal.fire('Lista vacía', 'No hay datos para exportar', 'info');
        return;
    }
    
    const csvContent = [
        ['Usuario', 'Discord ID', 'Motivo', 'Agregado por', 'Fecha'],
        ...blacklistData.map(item => [
            item.username,
            item.discord_id,
            item.reason,
            item.added_by_name,
            formatDate(item.created_at)
        ])
    ];
    
    exportToCSV(csvContent, 'blacklist');
    showNotification('Blacklist exportada correctamente', 'success');
}

/**
 * Formatear fecha
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}
