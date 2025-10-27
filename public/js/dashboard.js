// Dashboard.js - Carga de estadísticas y actividad reciente

async function loadStats() {
    try {
        const stats = await fetchAPI('/api/stats');
        
        const statsHTML = `
            <div class="stat-card">
                <div class="stat-icon red">
                    <i class="fas fa-ban"></i>
                </div>
                <div class="stat-details">
                    <h4>Baneos Totales</h4>
                    <div class="stat-number">${stats.bans?.total || 0}</div>
                    <div class="stat-sub">${stats.bans?.active || 0} activos</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon orange">
                    <i class="fas fa-lock"></i>
                </div>
                <div class="stat-details">
                    <h4>Jails Totales</h4>
                    <div class="stat-number">${stats.jails?.total || 0}</div>
                    <div class="stat-sub">${stats.jails?.active || 0} activos</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon purple">
                    <i class="fas fa-user-secret"></i>
                </div>
                <div class="stat-details">
                    <h4>Hackers Reportados</h4>
                    <div class="stat-number">${stats.hackers?.total || 0}</div>
                    <div class="stat-sub">${stats.hackers?.pending || 0} pendientes</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon blue">
                    <i class="fas fa-undo"></i>
                </div>
                <div class="stat-details">
                    <h4>Devoluciones</h4>
                    <div class="stat-number">${stats.refunds?.total || 0}</div>
                    <div class="stat-sub">${stats.refunds?.pending || 0} pendientes</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon green">
                    <i class="fas fa-donate"></i>
                </div>
                <div class="stat-details">
                    <h4>Donaciones</h4>
                    <div class="stat-number">${stats.donations?.total || 0}</div>
                    <div class="stat-sub">$${parseFloat(stats.totalRevenue || 0).toFixed(2)} total</div>
                </div>
            </div>
        `;
        
        document.getElementById('statsGrid').innerHTML = statsHTML;
    } catch (error) {
        console.error('Error loading stats:', error);
        document.getElementById('statsGrid').innerHTML = '<p style="text-align: center; color: var(--error-red); padding: 20px;">Error al cargar estadísticas</p>';
    }
}

async function loadRecentActivity() {
    try {
        const logs = await fetchAPI('/api/activity-logs?limit=10');
        
        if (!logs || logs.length === 0) {
            document.getElementById('recentActivity').innerHTML = '<p style="text-align: center; color: var(--accent-white); padding: 20px;">No hay actividad reciente</p>';
            return;
        }
        
        const activityHTML = logs.map(log => {
            const icon = getActionIcon(log.action);
            const color = getActionColor(log.action);
            
            return `
                <div class="activity-item">
                    <div class="activity-icon" style="background: ${color}20; color: ${color};">
                        <i class="${icon}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-action">${log.username} - ${log.description}</div>
                        <div class="activity-time">${formatRelativeTime(log.created_at)}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        document.getElementById('recentActivity').innerHTML = activityHTML;
    } catch (error) {
        console.error('Error loading activity:', error);
        document.getElementById('recentActivity').innerHTML = '<p style="text-align: center; color: var(--error-red); padding: 20px;">Error al cargar actividad</p>';
    }
}

function getActionIcon(action) {
    const icons = {
        'CREATE_BAN': 'fas fa-ban',
        'CREATE_JAIL': 'fas fa-lock',
        'CREATE_HACKER': 'fas fa-user-secret',
        'CREATE_REFUND': 'fas fa-undo',
        'CREATE_DONATION': 'fas fa-donate',
        'UPDATE_BAN': 'fas fa-edit',
        'UPDATE_JAIL': 'fas fa-edit',
        'UPDATE_HACKER': 'fas fa-edit',
        'UPDATE_REFUND': 'fas fa-edit',
        'UPDATE_DONATION': 'fas fa-edit',
        'DELETE_BAN': 'fas fa-trash',
        'DELETE_JAIL': 'fas fa-trash',
        'DELETE_HACKER': 'fas fa-trash',
        'DELETE_REFUND': 'fas fa-trash',
        'DELETE_DONATION': 'fas fa-trash',
        'RELEASE_JAIL': 'fas fa-unlock',
        'RESOLVE_HACKER': 'fas fa-check'
    };
    
    return icons[action] || 'fas fa-circle';
}

function getActionColor(action) {
    if (action.startsWith('CREATE')) return '#00ff88';
    if (action.startsWith('UPDATE')) return '#00aaff';
    if (action.startsWith('DELETE')) return '#ff4444';
    if (action.includes('RELEASE') || action.includes('RESOLVE')) return '#ffaa00';
    return '#ffffff';
}

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadRecentActivity();
    
    // Mostrar mensaje de bienvenida
    Swal.fire({
        title: '¡Bienvenido al Panel de Staff!',
        html: `
            <div style="text-align: left;">
                <p>🎮 Has iniciado sesión correctamente</p>
                <p>📊 Sistema de gestión activo</p>
                <p>💬 Chat en tiempo real disponible</p>
                <p>🔔 Notificaciones activadas</p>
            </div>
        `,
        icon: 'success',
        timer: 3000,
        timerProgressBar: true,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        background: '#1a1a1a',
        color: '#ffffff',
        iconColor: '#00ff88'
    });
    
    // Actualizar cada 30 segundos
    setInterval(() => {
        loadStats();
        loadRecentActivity();
    }, 30000);
    
    // Mostrar notificación de actualización cada 30 segundos
    setInterval(() => {
        showNotification('Datos actualizados', 'info');
    }, 30000);
});
