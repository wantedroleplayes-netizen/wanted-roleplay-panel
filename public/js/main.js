// Funciones globales
function showNotification(message, type = 'info') {
    const iconTypes = {
        'success': 'success',
        'error': 'error',
        'warning': 'warning',
        'info': 'info'
    };
    
    const colorTypes = {
        'success': '#00ff88',
        'error': '#ff4444',
        'warning': '#ffaa00',
        'info': '#00aaff'
    };
    
    Swal.fire({
        icon: iconTypes[type],
        title: type === 'success' ? '¡Éxito!' : type === 'error' ? 'Error' : type === 'warning' ? 'Advertencia' : 'Información',
        text: message,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#1a1a1a',
        color: '#ffffff',
        iconColor: colorTypes[type],
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });
}

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

function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Hace un momento';
    if (minutes < 60) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    return `Hace ${days} día${days > 1 ? 's' : ''}`;
}

// Navegación activa
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        if (item.getAttribute('href') === currentPath) {
            item.classList.add('active');
        }
    });
});

// API Helpers
async function fetchAPI(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            // Mostrar error específico del servidor si existe
            const errorMessage = data.error || `Error del servidor (${response.status})`;
            showNotification(errorMessage, 'error');
            throw new Error(errorMessage);
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        if (error.message !== error.toString()) {
            showNotification('Error al comunicarse con el servidor', 'error');
        }
        throw error;
    }
}

async function createRecord(endpoint, data) {
    return await fetchAPI(`/api/${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

async function updateRecord(endpoint, id, data) {
    return await fetchAPI(`/api/${endpoint}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

async function deleteRecord(endpoint, id) {
    return await fetchAPI(`/api/${endpoint}/${id}`, {
        method: 'DELETE'
    });
}

async function getRecords(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await fetchAPI(`/api/${endpoint}${queryString ? '?' + queryString : ''}`);
}
