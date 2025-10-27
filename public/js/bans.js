// Gestión de Baneos

let currentBans = [];

function toggleForm() {
    const form = document.getElementById('newBanForm');
    if (form.style.display === 'none') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
        form.querySelector('form').reset();
    }
}

async function createBan(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const result = await createRecord('bans', data);
        showNotification('Baneo registrado exitosamente', 'success');
        toggleForm();
        loadBans();
    } catch (error) {
        showNotification('Error al registrar baneo', 'error');
    }
}

async function loadBans(activeOnly = false) {
    try {
        const params = activeOnly ? { active: 'true' } : {};
        currentBans = await getRecords('bans', params);
        renderBansTable();
    } catch (error) {
        document.getElementById('bansTable').innerHTML = '<p class="loading">Error al cargar baneos</p>';
    }
}

async function searchBans() {
    const searchTerm = document.getElementById('searchInput').value;
    if (!searchTerm) {
        loadBans();
        return;
    }
    
    try {
        currentBans = await getRecords('bans', { search: searchTerm });
        renderBansTable();
    } catch (error) {
        showNotification('Error al buscar', 'error');
    }
}

function renderBansTable() {
    const container = document.getElementById('bansTable');
    
    if (currentBans.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--accent-white); padding: 40px;">No se encontraron baneos</p>';
        return;
    }
    
    const tableHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Jugador</th>
                    <th>Razón</th>
                    <th>Duración</th>
                    <th>Baneado por</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${currentBans.map(ban => `
                    <tr>
                        <td>#${ban.id}</td>
                        <td>
                            <strong>${ban.player_name}</strong>
                            ${ban.player_id ? `<br><small>${ban.player_id}</small>` : ''}
                        </td>
                        <td>${ban.reason.substring(0, 50)}${ban.reason.length > 50 ? '...' : ''}</td>
                        <td>${ban.duration || 'Permanente'}</td>
                        <td>${ban.banned_by_name}</td>
                        <td>${formatDate(ban.created_at)}</td>
                        <td>
                            <span class="badge ${ban.is_active ? 'badge-danger' : 'badge-success'}">
                                ${ban.is_active ? 'Activo' : 'Inactivo'}
                            </span>
                        </td>
                        <td>
                            <button class="btn btn-secondary" onclick="viewDetails(${ban.id})" style="padding: 5px 10px; font-size: 0.85rem;">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-danger" onclick="deleteBan(${ban.id})" style="padding: 5px 10px; font-size: 0.85rem;">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = tableHTML;
}

function viewDetails(id) {
    const ban = currentBans.find(b => b.id === id);
    if (!ban) return;
    
    alert(`Detalles del Baneo #${id}\n\n` +
          `Jugador: ${ban.player_name}\n` +
          `ID: ${ban.player_id || 'N/A'}\n` +
          `Razón: ${ban.reason}\n` +
          `Duración: ${ban.duration || 'Permanente'}\n` +
          `Baneado por: ${ban.banned_by_name}\n` +
          `Fecha: ${formatDate(ban.created_at)}\n` +
          `Evidencia: ${ban.evidence_url || 'No proporcionada'}\n` +
          `Notas: ${ban.notes || 'Sin notas'}`);
}

async function deleteBan(id) {
    const ban = currentBans.find(b => b.id === id);
    
    const result = await Swal.fire({
        title: '⚠️ ¿Eliminar Baneo?',
        html: `
            <div style="text-align: left;">
                <p>Estás a punto de eliminar el siguiente baneo:</p>
                <div style="background: #0a0a0a; padding: 15px; border-radius: 10px; margin: 15px 0;">
                    <p><strong>Jugador:</strong> ${ban.player_name}</p>
                    <p><strong>Razón:</strong> ${ban.reason}</p>
                    <p><strong>Baneado por:</strong> ${ban.banned_by_name}</p>
                </div>
                <p style="color: #ff4444; font-weight: bold;">⚠️ Esta acción no se puede deshacer</p>
            </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff4444',
        cancelButtonColor: '#3a3a3a',
        confirmButtonText: '🗑️ Sí, eliminar',
        cancelButtonText: 'Cancelar',
        background: '#1a1a1a',
        color: '#ffffff',
        reverseButtons: true
    });
    
    if (!result.isConfirmed) return;
    
    try {
        Swal.fire({
            title: 'Eliminando...',
            didOpen: () => Swal.showLoading(),
            allowOutsideClick: false,
            background: '#1a1a1a'
        });
        
        await deleteRecord('bans', id);
        
        await Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: 'El baneo ha sido eliminado correctamente',
            timer: 2000,
            showConfirmButton: false,
            background: '#1a1a1a',
            color: '#ffffff'
        });
        
        loadBans();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el baneo',
            background: '#1a1a1a',
            color: '#ffffff',
            confirmButtonColor: '#ff4444'
        });
    }
}

// Cargar baneos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadBans();
    
    // Enter en búsqueda
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBans();
        }
    });
});
