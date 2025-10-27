// Gestión de Hackers

let currentHackers = [];

function toggleForm() {
    const form = document.getElementById('newHackerForm');
    if (form.style.display === 'none') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
        form.querySelector('form').reset();
    }
}

async function createHacker(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const result = await createRecord('hackers', data);
        showNotification('Reporte de hacker registrado exitosamente', 'success');
        toggleForm();
        loadHackers();
    } catch (error) {
        showNotification('Error al registrar reporte', 'error');
    }
}

async function loadHackers(unresolvedOnly = false) {
    try {
        const params = unresolvedOnly ? { unresolved: 'true' } : {};
        currentHackers = await getRecords('hackers', params);
        renderHackersTable();
    } catch (error) {
        document.getElementById('hackersTable').innerHTML = '<p class="loading">Error al cargar reportes</p>';
    }
}

async function searchHackers() {
    const searchTerm = document.getElementById('searchInput').value;
    if (!searchTerm) {
        loadHackers();
        return;
    }
    
    try {
        currentHackers = await getRecords('hackers', { search: searchTerm });
        renderHackersTable();
    } catch (error) {
        showNotification('Error al buscar', 'error');
    }
}

function renderHackersTable() {
    const container = document.getElementById('hackersTable');
    
    if (currentHackers.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--accent-white); padding: 40px;">No se encontraron reportes</p>';
        return;
    }
    
    const tableHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Jugador</th>
                    <th>Tipo de Hack</th>
                    <th>Descripción</th>
                    <th>Reportado por</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${currentHackers.map(hacker => `
                    <tr>
                        <td>#${hacker.id}</td>
                        <td>
                            <strong>${hacker.player_name}</strong>
                            ${hacker.player_id ? `<br><small>${hacker.player_id}</small>` : ''}
                        </td>
                        <td><span class="badge badge-danger">${hacker.hack_type}</span></td>
                        <td>${hacker.description.substring(0, 50)}${hacker.description.length > 50 ? '...' : ''}</td>
                        <td>${hacker.reported_by_name}</td>
                        <td>${formatDate(hacker.created_at)}</td>
                        <td>
                            ${hacker.is_resolved ? 
                                '<span class="badge badge-success">Resuelto</span>' : 
                                '<span class="badge badge-warning">Pendiente</span>'
                            }
                        </td>
                        <td>
                            <button class="btn btn-secondary" onclick="viewDetails(${hacker.id})" style="padding: 5px 10px; font-size: 0.85rem;">
                                <i class="fas fa-eye"></i>
                            </button>
                            ${!hacker.is_resolved ? 
                                `<button class="btn btn-success" onclick="resolveHacker(${hacker.id})" style="padding: 5px 10px; font-size: 0.85rem;">
                                    <i class="fas fa-check"></i>
                                </button>` : ''
                            }
                            <button class="btn btn-danger" onclick="deleteHacker(${hacker.id})" style="padding: 5px 10px; font-size: 0.85rem;">
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
    const hacker = currentHackers.find(h => h.id === id);
    if (!hacker) return;
    
    alert(`Detalles del Reporte #${id}\n\n` +
          `Jugador: ${hacker.player_name}\n` +
          `ID: ${hacker.player_id || 'N/A'}\n` +
          `Tipo de Hack: ${hacker.hack_type}\n` +
          `Descripción: ${hacker.description}\n` +
          `Reportado por: ${hacker.reported_by_name}\n` +
          `Fecha: ${formatDate(hacker.created_at)}\n` +
          `Acción tomada: ${hacker.action_taken || 'Ninguna aún'}\n` +
          `Evidencia: ${hacker.evidence_url || 'No proporcionada'}\n` +
          `Notas: ${hacker.notes || 'Sin notas'}\n` +
          `Estado: ${hacker.is_resolved ? 'Resuelto' : 'Pendiente'}`);
}

async function resolveHacker(id) {
    const action = prompt('¿Qué acción se tomó con este reporte?', 'Baneado permanentemente');
    if (!action) return;
    
    try {
        await fetchAPI(`/api/hackers/${id}/resolve`, {
            method: 'POST',
            body: JSON.stringify({ action_taken: action })
        });
        showNotification('Reporte marcado como resuelto', 'success');
        loadHackers();
    } catch (error) {
        showNotification('Error al resolver reporte', 'error');
    }
}

async function deleteHacker(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este reporte?')) {
        return;
    }
    
    try {
        await deleteRecord('hackers', id);
        showNotification('Reporte eliminado', 'success');
        loadHackers();
    } catch (error) {
        showNotification('Error al eliminar reporte', 'error');
    }
}

// Cargar reportes al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadHackers();
    
    // Enter en búsqueda
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchHackers();
        }
    });
});
