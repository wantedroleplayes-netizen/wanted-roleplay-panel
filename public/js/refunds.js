// Gestión de Refunds

let currentRefunds = [];

function toggleForm() {
    const form = document.getElementById('newRefundForm');
    if (form.style.display === 'none') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
        form.querySelector('form').reset();
    }
}

async function createRefund(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const result = await createRecord('refunds', data);
        showNotification('Devolución registrada exitosamente', 'success');
        toggleForm();
        loadRefunds();
    } catch (error) {
        showNotification('Error al registrar devolución', 'error');
    }
}

async function loadRefunds(status = null) {
    try {
        const params = status ? { status } : {};
        currentRefunds = await getRecords('refunds', params);
        renderRefundsTable();
    } catch (error) {
        document.getElementById('refundsTable').innerHTML = '<p class="loading">Error al cargar devoluciones</p>';
    }
}

async function searchRefunds() {
    const searchTerm = document.getElementById('searchInput').value;
    if (!searchTerm) {
        loadRefunds();
        return;
    }
    
    try {
        currentRefunds = await getRecords('refunds', { search: searchTerm });
        renderRefundsTable();
    } catch (error) {
        showNotification('Error al buscar', 'error');
    }
}

async function filterByStatus() {
    const status = document.getElementById('statusFilter').value;
    if (status) {
        loadRefunds(status);
    } else {
        loadRefunds();
    }
}

function getStatusBadge(status) {
    const badges = {
        'pending': '<span class="badge badge-warning">Pendiente</span>',
        'approved': '<span class="badge badge-info">Aprobado</span>',
        'rejected': '<span class="badge badge-danger">Rechazado</span>',
        'completed': '<span class="badge badge-success">Completado</span>'
    };
    return badges[status] || status;
}

function renderRefundsTable() {
    const container = document.getElementById('refundsTable');
    
    if (currentRefunds.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--accent-white); padding: 40px;">No se encontraron devoluciones</p>';
        return;
    }
    
    const tableHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Jugador</th>
                    <th>Razón</th>
                    <th>Monto</th>
                    <th>Estado</th>
                    <th>Procesado por</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${currentRefunds.map(refund => `
                    <tr>
                        <td>#${refund.id}</td>
                        <td>
                            <strong>${refund.player_name}</strong>
                            ${refund.player_id ? `<br><small>${refund.player_id}</small>` : ''}
                        </td>
                        <td>${refund.reason.substring(0, 50)}${refund.reason.length > 50 ? '...' : ''}</td>
                        <td><strong style="color: var(--success-green);">$${parseFloat(refund.amount).toFixed(2)}</strong></td>
                        <td>${getStatusBadge(refund.status)}</td>
                        <td>${refund.processed_by_name}</td>
                        <td>${formatDate(refund.created_at)}</td>
                        <td>
                            <button class="btn btn-secondary" onclick="viewDetails(${refund.id})" style="padding: 5px 10px; font-size: 0.85rem;">
                                <i class="fas fa-eye"></i>
                            </button>
                            ${refund.status === 'pending' ? 
                                `<button class="btn btn-success" onclick="updateStatus(${refund.id}, 'approved')" style="padding: 5px 10px; font-size: 0.85rem;" title="Aprobar">
                                    <i class="fas fa-check"></i>
                                </button>
                                <button class="btn btn-danger" onclick="updateStatus(${refund.id}, 'rejected')" style="padding: 5px 10px; font-size: 0.85rem;" title="Rechazar">
                                    <i class="fas fa-times"></i>
                                </button>` : ''
                            }
                            ${refund.status === 'approved' ? 
                                `<button class="btn btn-info" onclick="updateStatus(${refund.id}, 'completed')" style="padding: 5px 10px; font-size: 0.85rem;" title="Completar">
                                    <i class="fas fa-check-double"></i>
                                </button>` : ''
                            }
                            <button class="btn btn-danger" onclick="deleteRefund(${refund.id})" style="padding: 5px 10px; font-size: 0.85rem;">
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
    const refund = currentRefunds.find(r => r.id === id);
    if (!refund) return;
    
    alert(`Detalles de la Devolución #${id}\n\n` +
          `Jugador: ${refund.player_name}\n` +
          `ID: ${refund.player_id || 'N/A'}\n` +
          `Razón: ${refund.reason}\n` +
          `Monto: $${parseFloat(refund.amount).toFixed(2)}\n` +
          `Items: ${refund.items || 'No especificado'}\n` +
          `Estado: ${refund.status}\n` +
          `Procesado por: ${refund.processed_by_name}\n` +
          `Fecha: ${formatDate(refund.created_at)}\n` +
          `Notas: ${refund.notes || 'Sin notas'}`);
}

async function updateStatus(id, newStatus) {
    const statusNames = {
        'approved': 'aprobar',
        'rejected': 'rechazar',
        'completed': 'completar'
    };
    
    if (!confirm(`¿Estás seguro de que deseas ${statusNames[newStatus]} esta devolución?`)) {
        return;
    }
    
    try {
        await fetchAPI(`/api/refunds/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ status: newStatus })
        });
        showNotification(`Devolución ${statusNames[newStatus]}da exitosamente`, 'success');
        loadRefunds();
    } catch (error) {
        showNotification('Error al actualizar estado', 'error');
    }
}

async function deleteRefund(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta devolución?')) {
        return;
    }
    
    try {
        await deleteRecord('refunds', id);
        showNotification('Devolución eliminada', 'success');
        loadRefunds();
    } catch (error) {
        showNotification('Error al eliminar devolución', 'error');
    }
}

// Cargar devoluciones al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadRefunds();
    
    // Enter en búsqueda
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchRefunds();
        }
    });
});
