// Gestión de Logs de Actividad

let currentLogs = [];

async function loadActivityLogs() {
    try {
        const actionFilter = document.getElementById('actionFilter').value;
        const limit = document.getElementById('limitFilter').value;
        
        const params = { limit };
        if (actionFilter) {
            params.action = actionFilter;
        }
        
        currentLogs = await getRecords('activity-logs', params);
        renderActivityTable();
    } catch (error) {
        document.getElementById('activityTable').innerHTML = '<p class="loading">Error al cargar logs de actividad</p>';
    }
}

function renderActivityTable() {
    const container = document.getElementById('activityTable');
    
    if (currentLogs.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--accent-white); padding: 40px;">No se encontraron registros de actividad</p>';
        return;
    }
    
    const tableHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Acción</th>
                    <th>Descripción</th>
                    <th>Tabla</th>
                    <th>Registro</th>
                    <th>IP</th>
                    <th>Fecha</th>
                </tr>
            </thead>
            <tbody>
                ${currentLogs.map(log => {
                    const actionColor = getActionColorClass(log.action);
                    const actionIcon = getActionIcon(log.action);
                    
                    return `
                        <tr>
                            <td>#${log.id}</td>
                            <td>
                                <strong>${log.username}</strong>
                            </td>
                            <td>
                                <span class="badge ${actionColor}">
                                    <i class="${actionIcon}"></i>
                                    ${formatActionName(log.action)}
                                </span>
                            </td>
                            <td>${log.description}</td>
                            <td>${log.table_name || 'N/A'}</td>
                            <td>${log.record_id ? '#' + log.record_id : 'N/A'}</td>
                            <td><small>${log.ip_address || 'N/A'}</small></td>
                            <td>
                                ${formatDate(log.created_at)}
                                <br>
                                <small style="color: var(--accent-white);">${formatRelativeTime(log.created_at)}</small>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = tableHTML;
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

function getActionColorClass(action) {
    if (action.includes('CREATE')) return 'badge-success';
    if (action.includes('UPDATE')) return 'badge-info';
    if (action.includes('DELETE')) return 'badge-danger';
    if (action.includes('RELEASE') || action.includes('RESOLVE')) return 'badge-warning';
    return 'badge-info';
}

function formatActionName(action) {
    const parts = action.split('_');
    return parts.map(part => part.charAt(0) + part.slice(1).toLowerCase()).join(' ');
}

function resetFilters() {
    document.getElementById('actionFilter').value = '';
    document.getElementById('limitFilter').value = '100';
    loadActivityLogs();
}

// Cargar logs al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadActivityLogs();
    
    // Auto-actualizar cada 30 segundos
    setInterval(loadActivityLogs, 30000);
});
