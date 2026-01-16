class ProfileViewModel {
    constructor() {
        this.userId = sessionStorage.getItem('user_id');
        
        if(!this.userId) {
            window.location.href = 'login.html';
            return;
        }

        this.displayUserData();
        this.setupLogout();
    }

    displayUserData() {
        // Mostrar todos los datos del usuario
        document.getElementById('user-name').textContent = sessionStorage.getItem('user_name') || 'No especificado';
        document.getElementById('user-email').textContent = sessionStorage.getItem('email') || 'No especificado';
        document.getElementById('user-skin-type').textContent = sessionStorage.getItem('skin_type') || 'No especificado';
        document.getElementById('user-occupation').textContent = sessionStorage.getItem('occupation') || 'No especificado';
        document.getElementById('user-exposure-level').textContent = sessionStorage.getItem('exposure_level') || 'No especificado';
    }

    setupLogout() {
        document.getElementById('logout-btn').addEventListener('click', () => {
            sessionStorage.clear();
            window.location.href = 'login.html';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProfileViewModel();
});