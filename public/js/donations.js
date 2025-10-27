// Gestión de Donations

let currentDonations = [];

function toggleForm() {
    const form = document.getElementById('newDonationForm');
    if (form.style.display === 'none') {
        form.style.display = 'block';
        // Animar la aparición
        form.style.animation = 'slideInDown 0.3s ease';
    } else {
        form.style.animation = 'slideOutUp 0.3s ease';
        setTimeout(() => {
            form.style.display = 'none';
            form.querySelector('form').reset();
        }, 300);
    }
}

async function createDonation(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Validar datos
    if (!data.donor_name || !data.amount) {
        Swal.fire({
            icon: 'error',
            title: 'Campos requeridos',
            text: 'Por favor completa el nombre del donador y el monto',
            background: '#1a1a1a',
            color: '#ffffff',
            confirmButtonColor: '#00ff88'
        });
        return;
    }
    
    if (parseFloat(data.amount) <= 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Monto inválido',
            text: 'El monto debe ser mayor a 0',
            background: '#1a1a1a',
            color: '#ffffff',
            confirmButtonColor: '#00ff88'
        });
        return;
    }
    
    // Mostrar loading
    Swal.fire({
        title: 'Registrando donación...',
        html: 'Por favor espera un momento',
        background: '#1a1a1a',
        color: '#ffffff',
        didOpen: () => {
            Swal.showLoading();
        },
        allowOutsideClick: false
    });
    
    try {
        const result = await createRecord('donations', data);
        
        await Swal.fire({
            icon: 'success',
            title: '¡Donación Registrada!',
            html: `
                <div style="text-align: left;">
                    <p><strong>Donador:</strong> ${data.donor_name}</p>
                    <p><strong>Monto:</strong> <span style="color: #00ff88; font-size: 1.5rem; font-weight: bold;">$${parseFloat(data.amount).toFixed(2)}</span></p>
                    ${data.payment_method ? `<p><strong>Método:</strong> ${data.payment_method}</p>` : ''}
                    ${data.message ? `<p><strong>Mensaje:</strong> "${data.message}"</p>` : ''}
                </div>
            `,
            background: '#1a1a1a',
            color: '#ffffff',
            confirmButtonColor: '#00ff88',
            showConfirmButton: true,
            timer: 5000
        });
        
        toggleForm();
        loadDonations();
        loadStats();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error al registrar',
            text: error.message || 'No se pudo registrar la donación',
            background: '#1a1a1a',
            color: '#ffffff',
            confirmButtonColor: '#ff4444'
        });
    }
}

async function loadDonations(method = null) {
    try {
        const params = method ? { payment_method: method } : {};
        currentDonations = await getRecords('donations', params);
        renderDonationsTable();
    } catch (error) {
        document.getElementById('donationsTable').innerHTML = '<p class="loading">Error al cargar donaciones</p>';
    }
}

async function loadStats() {
    try {
        const donations = await getRecords('donations');
        
        // Total donado
        const total = donations.reduce((sum, d) => sum + parseFloat(d.amount), 0);
        document.getElementById('totalDonated').textContent = `$${total.toFixed(2)}`;
        
        // Este mes
        const now = new Date();
        const thisMonth = donations.filter(d => {
            const donationDate = new Date(d.created_at);
            return donationDate.getMonth() === now.getMonth() && 
                   donationDate.getFullYear() === now.getFullYear();
        });
        const monthlyTotal = thisMonth.reduce((sum, d) => sum + parseFloat(d.amount), 0);
        document.getElementById('monthlyDonations').textContent = `$${monthlyTotal.toFixed(2)}`;
        
        // Donadores únicos
        const uniqueDonors = new Set(donations.map(d => d.donor_name.toLowerCase()));
        document.getElementById('totalDonors').textContent = uniqueDonors.size;
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    }
}

async function searchDonations() {
    const searchTerm = document.getElementById('searchInput').value;
    if (!searchTerm) {
        loadDonations();
        return;
    }
    
    try {
        currentDonations = await getRecords('donations', { search: searchTerm });
        renderDonationsTable();
    } catch (error) {
        showNotification('Error al buscar', 'error');
    }
}

async function filterByMethod() {
    const method = document.getElementById('methodFilter').value;
    if (method) {
        loadDonations(method);
    } else {
        loadDonations();
    }
}

function renderDonationsTable() {
    const container = document.getElementById('donationsTable');
    
    if (currentDonations.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--accent-white); padding: 40px;">No se encontraron donaciones</p>';
        return;
    }
    
    const tableHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Donador</th>
                    <th>Monto</th>
                    <th>Método</th>
                    <th>Mensaje</th>
                    <th>Registrado por</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${currentDonations.map(donation => `
                    <tr>
                        <td>#${donation.id}</td>
                        <td>
                            <strong>${donation.donor_name}</strong>
                            ${donation.player_id ? `<br><small>${donation.player_id}</small>` : ''}
                        </td>
                        <td>
                            <strong style="color: var(--success-green); font-size: 1.1rem;">
                                $${parseFloat(donation.amount).toFixed(2)}
                            </strong>
                        </td>
                        <td>
                            ${donation.payment_method ? 
                                `<span class="badge badge-info">${donation.payment_method}</span>` : 
                                '<span style="color: #666;">N/A</span>'
                            }
                        </td>
                        <td>
                            ${donation.message ? 
                                `<em>${donation.message.substring(0, 30)}${donation.message.length > 30 ? '...' : ''}</em>` : 
                                '<span style="color: #666;">Sin mensaje</span>'
                            }
                        </td>
                        <td>${donation.recorded_by_name}</td>
                        <td>${formatDate(donation.created_at)}</td>
                        <td>
                            <button class="btn btn-secondary" onclick="viewDetails(${donation.id})" style="padding: 5px 10px; font-size: 0.85rem;">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-danger" onclick="deleteDonation(${donation.id})" style="padding: 5px 10px; font-size: 0.85rem;">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div style="margin-top: 20px; padding: 15px; background: var(--card-bg); border-radius: 8px; text-align: right;">
            <strong style="color: var(--accent-white);">Total en esta lista: </strong>
            <span style="color: var(--success-green); font-size: 1.3rem; font-weight: bold;">
                $${currentDonations.reduce((sum, d) => sum + parseFloat(d.amount), 0).toFixed(2)}
            </span>
        </div>
    `;
    
    container.innerHTML = tableHTML;
}

function viewDetails(id) {
    const donation = currentDonations.find(d => d.id === id);
    if (!donation) return;
    
    Swal.fire({
        title: `💎 Donación #${id}`,
        html: `
            <div style="text-align: left; padding: 20px;">
                <div style="background: #0a0a0a; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                    <h3 style="color: #00ff88; margin-bottom: 10px;">Información del Donador</h3>
                    <p><strong>👤 Nombre:</strong> ${donation.donor_name}</p>
                    <p><strong>🎮 ID:</strong> ${donation.player_id || 'No proporcionado'}</p>
                </div>
                
                <div style="background: #0a0a0a; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                    <h3 style="color: #00aaff; margin-bottom: 10px;">Detalles de la Donación</h3>
                    <p><strong>💰 Monto:</strong> <span style="color: #00ff88; font-size: 1.5rem; font-weight: bold;">$${parseFloat(donation.amount).toFixed(2)}</span></p>
                    <p><strong>💳 Método:</strong> ${donation.payment_method || 'No especificado'}</p>
                    <p><strong>🔑 ID Transacción:</strong> ${donation.transaction_id || 'N/A'}</p>
                </div>
                
                ${donation.message ? `
                <div style="background: #0a0a0a; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                    <h3 style="color: #ffaa00; margin-bottom: 10px;">💬 Mensaje</h3>
                    <p style="font-style: italic;">"${donation.message}"</p>
                </div>
                ` : ''}
                
                <div style="background: #0a0a0a; padding: 15px; border-radius: 10px;">
                    <h3 style="color: #e8e8e8; margin-bottom: 10px;">📊 Información del Registro</h3>
                    <p><strong>👮 Registrado por:</strong> ${donation.recorded_by_name}</p>
                    <p><strong>📅 Fecha:</strong> ${formatDate(donation.created_at)}</p>
                    ${donation.notes ? `<p><strong>📝 Notas:</strong> ${donation.notes}</p>` : ''}
                </div>
            </div>
        `,
        width: '600px',
        background: '#1a1a1a',
        color: '#ffffff',
        confirmButtonColor: '#00ff88',
        confirmButtonText: 'Cerrar'
    });
}

async function deleteDonation(id) {
    const donation = currentDonations.find(d => d.id === id);
    
    const result = await Swal.fire({
        title: '⚠️ ¿Eliminar Donación?',
        html: `
            <div style="text-align: left;">
                <p>Estás a punto de eliminar la siguiente donación:</p>
                <div style="background: #0a0a0a; padding: 15px; border-radius: 10px; margin: 15px 0;">
                    <p><strong>Donador:</strong> ${donation.donor_name}</p>
                    <p><strong>Monto:</strong> <span style="color: #00ff88;">$${parseFloat(donation.amount).toFixed(2)}</span></p>
                    <p><strong>Fecha:</strong> ${formatDate(donation.created_at)}</p>
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
        
        await deleteRecord('donations', id);
        
        await Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: 'La donación ha sido eliminada correctamente',
            timer: 2000,
            showConfirmButton: false,
            background: '#1a1a1a',
            color: '#ffffff'
        });
        
        loadDonations();
        loadStats();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar la donación',
            background: '#1a1a1a',
            color: '#ffffff',
            confirmButtonColor: '#ff4444'
        });
    }
}

// Cargar donaciones y estadísticas al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadDonations();
    loadStats();
    
    // Enter en búsqueda
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchDonations();
        }
    });
    
    // Búsqueda en tiempo real con debounce
    const searchInput = document.getElementById('searchInput');
    if (typeof debounce === 'function') {
        searchInput.addEventListener('input', debounce(() => {
            if (searchInput.value.length >= 3 || searchInput.value.length === 0) {
                searchDonations();
            }
        }, 500));
    }
});

// Exportar donaciones a CSV
function exportDonations() {
    if (!currentDonations || currentDonations.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Sin datos',
            text: 'No hay donaciones para exportar',
            background: '#1a1a1a',
            color: '#ffffff',
            confirmButtonColor: '#00ff88'
        });
        return;
    }
    
    const exportData = currentDonations.map(d => ({
        ID: d.id,
        Donador: d.donor_name,
        'ID Jugador': d.player_id || 'N/A',
        Monto: parseFloat(d.amount).toFixed(2),
        'Método de Pago': d.payment_method || 'N/A',
        'ID Transacción': d.transaction_id || 'N/A',
        Mensaje: d.message || 'N/A',
        'Registrado por': d.recorded_by_name,
        Fecha: formatDate(d.created_at)
    }));
    
    exportToCSV(exportData, 'donaciones');
}

// Mostrar estadísticas detalladas
async function showDetailedStats() {
    const donations = await getRecords('donations');
    
    const totalAmount = donations.reduce((sum, d) => sum + parseFloat(d.amount), 0);
    const avgDonation = totalAmount / donations.length;
    const maxDonation = Math.max(...donations.map(d => parseFloat(d.amount)));
    const minDonation = Math.min(...donations.map(d => parseFloat(d.amount)));
    
    // Donaciones por método
    const byMethod = {};
    donations.forEach(d => {
        const method = d.payment_method || 'No especificado';
        byMethod[method] = (byMethod[method] || 0) + 1;
    });
    
    Swal.fire({
        title: '📊 Estadísticas Detalladas',
        html: `
            <div style="text-align: left;">
                <div style="background: #0a0a0a; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                    <h3 style="color: #00ff88; margin-bottom: 10px;">💰 Montos</h3>
                    <p><strong>Total:</strong> $${totalAmount.toFixed(2)}</p>
                    <p><strong>Promedio:</strong> $${avgDonation.toFixed(2)}</p>
                    <p><strong>Máxima:</strong> $${maxDonation.toFixed(2)}</p>
                    <p><strong>Mínima:</strong> $${minDonation.toFixed(2)}</p>
                </div>
                
                <div style="background: #0a0a0a; padding: 15px; border-radius: 10px;">
                    <h3 style="color: #00aaff; margin-bottom: 10px;">💳 Por Método de Pago</h3>
                    ${Object.entries(byMethod).map(([method, count]) => 
                        `<p><strong>${method}:</strong> ${count} donaciones</p>`
                    ).join('')}
                </div>
            </div>
        `,
        width: '600px',
        background: '#1a1a1a',
        color: '#ffffff',
        confirmButtonColor: '#00ff88',
        confirmButtonText: 'Cerrar'
    });
}
