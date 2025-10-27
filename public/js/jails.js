// Gestión de Jails

let currentJails = [];

function toggleForm() {
    const form = document.getElementById('newJailForm');
    if (form.style.display === 'none') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
        form.querySelector('form').reset();
    }
}

async function createJail(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const result = await createRecord('jails', data);
        showNotification('Jail registrado exitosamente', 'success');
        toggleForm();
        loadJails();
    } catch (error) {
        showNotification('Error al registrar jail', 'error');
    }
}

async function loadJails(activeOnly = false) {
    try {
        const params = activeOnly ? { active: 'true' } : {};
        currentJails = await getRecords('jails', params);
        renderJailsTable();
    } catch (error) {
        document.getElementById('jailsTable').innerHTML = '<p class="loading">Error al cargar jails</p>';
    }
}

async function searchJails() {
    const searchTerm = document.getElementById('searchInput').value;
    if (!searchTerm) {
        loadJails();
        return;
    }
    
    try {
        currentJails = await getRecords('jails', { search: searchTerm });
        renderJailsTable();
    } catch (error) {
        showNotification('Error al buscar', 'error');
    }
}

function renderJailsTable() {
    const container = document.getElementById('jailsTable');
    
    if (currentJails.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--accent-white); padding: 40px;">No se encontraron jails</p>';
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
                    <th>Encarcelado por</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${currentJails.map(jail => `
                    <tr>
                        <td>#${jail.id}</td>
                        <td>
                            <strong>${jail.player_name}</strong>
                            ${jail.player_id ? `<br><small>${jail.player_id}</small>` : ''}
                        </td>
                        <td>${jail.reason.substring(0, 50)}${jail.reason.length > 50 ? '...' : ''}</td>
                        <td>${jail.duration}</td>
                        <td>${jail.jailed_by_name}</td>
                        <td>${formatDate(jail.created_at)}</td>
                        <td>
                            ${jail.is_active && !jail.released_at ? 
                                '<span class="badge badge-warning">Activo</span>' : 
                                `<span class="badge badge-success">Liberado ${jail.released_at ? formatDate(jail.released_at) : ''}</span>`
                            }
                        </td>
                        <td>
                            <button class="btn btn-secondary" onclick="viewDetails(${jail.id})" style="padding: 5px 10px; font-size: 0.85rem;">
                                <i class="fas fa-eye"></i>
                            </button>
                            ${jail.is_active && !jail.released_at ? 
                                `<button class="btn btn-success" onclick="releaseJail(${jail.id})" style="padding: 5px 10px; font-size: 0.85rem;">
                                    <i class="fas fa-unlock"></i>
                                </button>` : ''
                            }
                            <button class="btn btn-danger" onclick="deleteJail(${jail.id})" style="padding: 5px 10px; font-size: 0.85rem;">
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
    const jail = currentJails.find(j => j.id === id);
    if (!jail) return;
    
    alert(`Detalles del Jail #${id}\n\n` +
          `Jugador: ${jail.player_name}\n` +
          `ID: ${jail.player_id || 'N/A'}\n` +
          `Razón: ${jail.reason}\n` +
          `Duración: ${jail.duration}\n` +
          `Encarcelado por: ${jail.jailed_by_name}\n` +
          `Fecha: ${formatDate(jail.created_at)}\n` +
          `Liberado: ${jail.released_at ? formatDate(jail.released_at) : 'No'}\n` +
          `Evidencia: ${jail.evidence_url || 'No proporcionada'}\n` +
          `Notas: ${jail.notes || 'Sin notas'}`);
}

async function releaseJail(id) {
    if (!confirm('¿Estás seguro de que deseas liberar a este jugador del jail?')) {
        return;
    }
    
    try {
        await fetchAPI(`/api/jails/${id}/release`, { method: 'POST' });
        showNotification('Jugador liberado del jail', 'success');
        loadJails();
    } catch (error) {
        showNotification('Error al liberar jugador', 'error');
    }
}

async function deleteJail(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este jail?')) {
        return;
    }
    
    try {
        await deleteRecord('jails', id);
        showNotification('Jail eliminado', 'success');
        loadJails();
    } catch (error) {
        showNotification('Error al eliminar jail', 'error');
    }
}

// Cargar jails al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadJails();
    
    // Enter en búsqueda
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchJails();
        }
    });
});
