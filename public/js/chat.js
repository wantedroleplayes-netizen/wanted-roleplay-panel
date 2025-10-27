// Chat en tiempo real con Socket.IO

const socket = io();
let typingTimeout;

// Conectar al chat
socket.on('connect', () => {
    console.log('Conectado al chat');
});

// Recibir historial de mensajes
socket.on('chat:history', (messages) => {
    displayMessages(messages);
});

// Recibir nuevo mensaje
socket.on('chat:newMessage', (message) => {
    appendMessage(message);
});

// Usuario escribiendo
socket.on('chat:userTyping', (username) => {
    const indicator = document.getElementById('typingIndicator');
    indicator.textContent = `${username} está escribiendo...`;
    
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        indicator.textContent = '';
    }, 3000);
});

// Error en el chat
socket.on('chat:error', (error) => {
    showNotification(error, 'error');
});

// Enviar mensaje
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    socket.emit('chat:message', { message });
    input.value = '';
}

// Detectar tecla Enter
document.getElementById('messageInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Detectar cuando el usuario está escribiendo
document.getElementById('messageInput').addEventListener('input', () => {
    socket.emit('chat:typing');
});

// Mostrar mensajes
function displayMessages(messages) {
    const container = document.getElementById('chatMessages');
    
    if (messages.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--accent-white); padding: 40px;">No hay mensajes aún. ¡Sé el primero en escribir!</p>';
        return;
    }
    
    container.innerHTML = '';
    messages.forEach(msg => appendMessage(msg));
    scrollToBottom();
}

// Añadir un mensaje
function appendMessage(message) {
    const container = document.getElementById('chatMessages');
    
    // Si es el primer mensaje, limpiar el "no hay mensajes"
    if (container.querySelector('.loading') || container.querySelector('p')) {
        container.innerHTML = '';
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message';
    
    messageDiv.innerHTML = `
        <img src="/img/default-avatar.png" alt="${message.username}" class="chat-avatar">
        <div class="chat-content">
            <div class="chat-username">${message.username}</div>
            <div class="chat-text">${escapeHtml(message.message)}</div>
            <div class="chat-time">${formatRelativeTime(message.created_at)}</div>
        </div>
    `;
    
    container.appendChild(messageDiv);
    scrollToBottom();
}

// Scroll al final
function scrollToBottom() {
    const container = document.getElementById('chatMessages');
    container.scrollTop = container.scrollHeight;
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Auto-scroll cuando hay nuevos mensajes
const observer = new MutationObserver(() => {
    scrollToBottom();
});

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('chatMessages');
    observer.observe(container, { childList: true });
});
