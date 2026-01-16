document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const notificationBell = document.getElementById('notification-bell');
    const notificationDropdown = document.querySelector('.notification-dropdown');
    const notificationDropdownContent = document.getElementById('notification-dropdown-content');
    const notificationList = document.getElementById('notification-list');
    const notificationTemplate = document.getElementById('notification-template');
    const markAllReadBtn = document.getElementById('mark-all-read');
    const markAllReadFullBtn = document.getElementById('mark-all-read-full');
    const clearNotificationsBtn = document.getElementById('clear-notifications');
    const notificationTabs = document.querySelectorAll('.notification-tab');
    const notificationCount = document.querySelector('.notification-count');
    
    // Estado de las notificaciones
    let notifications = JSON.parse(localStorage.getItem('vanilla-notifications')) || [];
    let unreadCount = notifications.filter(n => !n.read).length;
    
    // Inicializar la UI
    updateNotificationCount();
    renderNotificationDropdown();
    renderFullNotificationList();
    
    // Toggle del dropdown
    notificationBell.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        
        if (this.classList.contains('active')) {
            renderNotificationDropdown();
        }
    });
    
    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', function() {
        notificationBell.classList.remove('active');
    });
    
    // Prevenir que el dropdown se cierre al hacer clic dentro
    notificationDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Función para renderizar el dropdown de notificaciones
    function renderNotificationDropdown(filter = 'all') {
        notificationDropdownContent.innerHTML = '';
        
        let filteredNotifications = notifications.slice(0, 8); // Mostrar solo las 8 más recientes en el dropdown
        
        if (filter !== 'all') {
            filteredNotifications = filteredNotifications.filter(n => n.type === filter);
        }
        
        if (filteredNotifications.length === 0) {
            notificationDropdownContent.innerHTML = `
                <div class="empty-notifications">
                    <p>No tienes notificaciones nuevas</p>
                </div>
            `;
            return;
        }
        
        filteredNotifications.forEach(notification => {
            const notificationElement = notificationTemplate.content.cloneNode(true);
            const notificationItem = notificationElement.querySelector('.notification-item');
            
            notificationItem.setAttribute('data-type', notification.type);
            notificationItem.setAttribute('data-read', notification.read);
            notificationItem.setAttribute('data-id', notification.id);
            
            // Configurar icono según tipo
            const iconMap = {
                'productos': '🛍️',
                'tendencias': '✨',
                'consejos': '💡'
            };
            
            notificationElement.querySelector('.icon').textContent = iconMap[notification.type] || '🔔';
            notificationElement.querySelector('.notification-message').textContent = notification.message;
            notificationElement.querySelector('.notification-time').textContent = formatTime(notification.timestamp);
            notificationElement.querySelector('.notification-category').textContent = getCategoryName(notification.type);
            
            // Configurar botones de acción
            notificationElement.querySelector('.important-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                markAsImportant(notification.id);
            });
            
            notificationElement.querySelector('.dismiss-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteNotification(notification.id, true);
            });
            
            // Marcar como leído al hacer clic
            notificationItem.addEventListener('click', (e) => {
                if (!e.target.classList.contains('notification-action-btn')) {
                    markAsRead(notification.id, true);
                }
            });
            
            notificationDropdownContent.appendChild(notificationElement);
        });
    }
    
    // Función para renderizar la lista completa de notificaciones
    function renderFullNotificationList(filter = 'all') {
        notificationList.innerHTML = '';
        
        let filteredNotifications = notifications;
        
        if (filter !== 'all') {
            filteredNotifications = notifications.filter(n => n.type === filter);
        }
        
        if (filteredNotifications.length === 0) {
            notificationList.innerHTML = `
                <div class="empty-state">
                    <img src="../images/notifications-empty.svg" alt="Sin notificaciones">
                    <p>No tienes notificaciones ${filter === 'all' ? '' : 'de este tipo'}</p>
                </div>
            `;
            return;
        }
        
        filteredNotifications.forEach(notification => {
            const notificationElement = notificationTemplate.content.cloneNode(true);
            const notificationItem = notificationElement.querySelector('.notification-item');
            
            notificationItem.setAttribute('data-type', notification.type);
            notificationItem.setAttribute('data-read', notification.read);
            notificationItem.setAttribute('data-id', notification.id);
            
            // Configurar icono según tipo
            const iconMap = {
                'productos': '🛍️',
                'tendencias': '✨',
                'consejos': '💡'
            };
            
            notificationElement.querySelector('.icon').textContent = iconMap[notification.type] || '🔔';
            notificationElement.querySelector('.notification-message').textContent = notification.message;
            notificationElement.querySelector('.notification-time').textContent = formatTime(notification.timestamp);
            notificationElement.querySelector('.notification-category').textContent = getCategoryName(notification.type);
            
            // Configurar botones de acción
            notificationElement.querySelector('.important-btn').addEventListener('click', () => {
                markAsImportant(notification.id);
            });
            
            notificationElement.querySelector('.dismiss-btn').addEventListener('click', () => {
                deleteNotification(notification.id);
            });
            
            // Marcar como leído al hacer clic
            notificationItem.addEventListener('click', function(e) {
                if (!e.target.classList.contains('notification-action-btn')) {
                    markAsRead(notification.id);
                }
            });
            
            notificationList.appendChild(notificationElement);
        });
    }
    
    // Función para agregar una nueva notificación
    function addNotification(type, message) {
        const newNotification = {
            id: Date.now().toString(),
            type,
            message,
            read: false,
            important: false,
            timestamp: new Date().getTime()
        };
        
        notifications.unshift(newNotification);
        saveNotifications();
        updateNotificationCount();
        
        // Mostrar notificación toast
        showToastNotification(newNotification);
        
        // Actualizar UI si está visible
        if (notificationBell.classList.contains('active')) {
            renderNotificationDropdown();
        }
    }
    
    // Función para mostrar notificación toast
    function showToastNotification(notification) {
        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.setAttribute('data-type', notification.type);
        
        const iconMap = {
            'productos': '🛍️',
            'tendencias': '✨',
            'consejos': '💡'
        };
        
        toast.innerHTML = `
            <span class="icon">${iconMap[notification.type] || '🔔'}</span>
            <div>
                <p>${notification.message}</p>
            </div>
            <button class="close-btn">×</button>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Cerrar notificación
        toast.querySelector('.close-btn').addEventListener('click', () => {
            toast.remove();
        });
        
        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 5000);
    }
    
    // Función para marcar notificación como leída
    function markAsRead(id, isDropdown = false) {
        const notificationIndex = notifications.findIndex(n => n.id === id);
        
        if (notificationIndex !== -1 && !notifications[notificationIndex].read) {
            notifications[notificationIndex].read = true;
            saveNotifications();
            updateNotificationCount();
            
            // Actualizar UI
            if (isDropdown) {
                renderNotificationDropdown();
            } else {
                const activeFilter = document.querySelector('.notification-tab.active').dataset.tab;
                renderFullNotificationList(activeFilter);
            }
        }
    }
    
    // Función para marcar como importante
    function markAsImportant(id) {
        const notificationIndex = notifications.findIndex(n => n.id === id);
        
        if (notificationIndex !== -1) {
            notifications[notificationIndex].important = !notifications[notificationIndex].important;
            saveNotifications();
            
            // Actualizar UI
            const activeFilter = document.querySelector('.notification-tab.active').dataset.tab;
            if (window.location.pathname.includes('notification-panel')) {
                renderFullNotificationList(activeFilter);
            } else {
                renderNotificationDropdown(activeFilter);
            }
        }
    }
    
    // Función para eliminar notificación
    function deleteNotification(id, isDropdown = false) {
        notifications = notifications.filter(n => n.id !== id);
        saveNotifications();
        updateNotificationCount();
        
        // Actualizar UI
        if (isDropdown) {
            renderNotificationDropdown();
        } else {
            const activeFilter = document.querySelector('.notification-tab.active').dataset.tab;
            renderFullNotificationList(activeFilter);
        }
    }
    
    // Función para marcar todas como leídas
    function markAllAsRead() {
        notifications = notifications.map(n => ({ ...n, read: true }));
        saveNotifications();
        updateNotificationCount();
        
        // Actualizar ambas vistas
        const activeFilter = document.querySelector('.notification-tab.active').dataset.tab;
        renderNotificationDropdown(activeFilter);
        renderFullNotificationList(activeFilter);
    }
    
    // Función para limpiar todas las notificaciones
    function clearAllNotifications() {
        notifications = [];
        saveNotifications();
        updateNotificationCount();
        renderFullNotificationList();
    }
    
    // Función para guardar notificaciones en localStorage
    function saveNotifications() {
        localStorage.setItem('vanilla-notifications', JSON.stringify(notifications));
    }
    
    // Función para actualizar el contador de notificaciones no leídas
    function updateNotificationCount() {
        unreadCount = notifications.filter(n => !n.read).length;
        
        if (unreadCount > 0) {
            notificationCount.textContent = unreadCount > 9 ? '9+' : unreadCount;
            notificationCount.style.display = 'flex';
        } else {
            notificationCount.style.display = 'none';
        }
    }
    
    // Funciones de ayuda
    function formatTime(timestamp) {
        const now = new Date();
        const date = new Date(timestamp);
        const diffInHours = (now - date) / (1000 * 60 * 60);
        
        if (diffInHours < 24) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    }
    
    function getCategoryName(type) {
        const names = {
            'productos': 'Productos',
            'tendencias': 'Tendencias',
            'consejos': 'Consejos'
        };
        
        return names[type] || type;
    }
    
    // Event Listeners
    markAllReadBtn.addEventListener('click', markAllAsRead);
    markAllReadFullBtn.addEventListener('click', markAllAsRead);
    clearNotificationsBtn.addEventListener('click', clearAllNotifications);
    
    notificationTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            notificationTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            if (window.location.pathname.includes('notification-panel')) {
                renderFullNotificationList(this.dataset.tab);
            } else {
                renderNotificationDropdown(this.dataset.tab);
            }
        });
    });
    
    // Simular notificaciones (en producción vendrían del servidor)
    function simulateNotifications() {
        const notificationTypes = [
            {
                type: 'productos',
                message: 'Nuevo lanzamiento: Paleta de sombras Ruby Rose en tonos tierra'
            },
            {
                type: 'tendencias',
                message: 'El skinimalism es la tendencia de maquillaje para 2025'
            },
            {
                type: 'consejos',
                message: 'Recuerda usar protector solar incluso en días nublados'
            }
        ];
        
        // Agregar notificaciones de ejemplo si no hay ninguna
        if (notifications.length === 0) {
            notificationTypes.forEach((type, index) => {
                setTimeout(() => {
                    addNotification(type.type, type.message);
                }, index * 2000);
            });
        }
    }
    
    // Inicializar simulación
    simulateNotifications();
    
    // En producción, esto se conectaría a un WebSocket o Firebase:
    // Ejemplo: 
    // const socket = new WebSocket('wss://tuservidor.com/notifications');
    // socket.onmessage = (event) => {
    //     const data = JSON.parse(event.data);
    //     addNotification(data.type, data.message);
    // };
});

// API pública para agregar notificaciones desde otros módulos
window.NotificationManager = {
    addNotification: function(type, message) {
        const event = new CustomEvent('newNotification', {
            detail: { type, message }
        });
        document.dispatchEvent(event);
    }
};

document.addEventListener('newNotification', function(e) {
    if (window.NotificationViewModel) {
        NotificationViewModel.addNotification(e.detail.type, e.detail.message);
    }
});

// Para agregar una notificación desde cualquier parte del sistema
window.NotificationManager.addNotification('productos', 'Nuevo producto disponible: Base líquida Dolce Bella');