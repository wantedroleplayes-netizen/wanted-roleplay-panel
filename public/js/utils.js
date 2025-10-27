// Funciones adicionales de utilidad

// Exportar datos a CSV
function exportToCSV(data, filename) {
    if (!data || data.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Sin datos',
            text: 'No hay datos para exportar',
            background: '#1a1a1a',
            color: '#ffffff',
            confirmButtonColor: '#00ff88'
        });
        return;
    }
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
            const value = row[header];
            // Escapar comillas y comas
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        }).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    Swal.fire({
        icon: 'success',
        title: '¡Exportado!',
        text: `Archivo ${filename}.csv descargado correctamente`,
        timer: 2000,
        showConfirmButton: false,
        background: '#1a1a1a',
        color: '#ffffff'
    });
}

// Copiar al portapapeles
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Copiado al portapapeles', 'success');
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo copiar al portapapeles',
            background: '#1a1a1a',
            color: '#ffffff',
            confirmButtonColor: '#ff4444'
        });
    }
}

// Formatear número con separadores de miles
function formatNumber(num) {
    return new Intl.NumberFormat('es-ES').format(num);
}

// Validar email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validar URL
function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Mostrar confirmación genérica
async function confirmAction(title, message, confirmText = 'Sí, continuar') {
    const result = await Swal.fire({
        title: title,
        text: message,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#00ff88',
        cancelButtonColor: '#3a3a3a',
        confirmButtonText: confirmText,
        cancelButtonText: 'Cancelar',
        background: '#1a1a1a',
        color: '#ffffff',
        reverseButtons: true
    });
    
    return result.isConfirmed;
}

// Mostrar input dialog
async function promptInput(title, placeholder, inputType = 'text') {
    const { value, isConfirmed } = await Swal.fire({
        title: title,
        input: inputType,
        inputPlaceholder: placeholder,
        showCancelButton: true,
        confirmButtonColor: '#00ff88',
        cancelButtonColor: '#3a3a3a',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        background: '#1a1a1a',
        color: '#ffffff',
        inputAttributes: {
            style: 'background: #0a0a0a; color: #ffffff; border: 1px solid #333;'
        }
    });
    
    if (isConfirmed) {
        return value;
    }
    return null;
}

// Calcular tiempo transcurrido
function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    const intervals = {
        año: 31536000,
        mes: 2592000,
        semana: 604800,
        día: 86400,
        hora: 3600,
        minuto: 60,
        segundo: 1
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `hace ${interval} ${unit}${interval !== 1 ? 's' : ''}`;
        }
    }
    
    return 'justo ahora';
}

// Generar color aleatorio
function randomColor() {
    const colors = ['#00ff88', '#00aaff', '#ffaa00', '#ff4444', '#aa66ff'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Debounce function para búsquedas
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Loading overlay
function showLoadingOverlay(message = 'Cargando...') {
    Swal.fire({
        title: message,
        html: 'Por favor espera un momento',
        background: '#1a1a1a',
        color: '#ffffff',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
}

function hideLoadingOverlay() {
    Swal.close();
}

// Confirmar acción peligrosa
async function confirmDangerousAction(title, message, warningText) {
    const result = await Swal.fire({
        title: title,
        html: `
            <div style="text-align: left;">
                <p>${message}</p>
                <p style="color: #ff4444; font-weight: bold; margin-top: 15px;">⚠️ ${warningText}</p>
            </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff4444',
        cancelButtonColor: '#3a3a3a',
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar',
        background: '#1a1a1a',
        color: '#ffffff',
        reverseButtons: true
    });
    
    return result.isConfirmed;
}
