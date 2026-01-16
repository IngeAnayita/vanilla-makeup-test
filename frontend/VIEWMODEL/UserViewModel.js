class UserViewModel {
    constructor() {
        // Elementos del Login
        this.email = document.getElementById('email');
        this.password = document.getElementById('password');
        this.loginBtn = document.getElementById('login-btn');
        this.errorElement = document.getElementById('error-message');

        if(this.loginBtn) {
            this.loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.login();
            });
        }
    }

    async login() {
        try {
            const response = await fetch('../PHP/user_controller.php?action=login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: this.email.value,
                    password: this.password.value
                })
            });
    
            const result = await response.json();
            
            if(result.success) {
                // Guardar todos los datos en sessionStorage
                sessionStorage.setItem('user_id', result.user_id);
                sessionStorage.setItem('user_name', result.user_name);
                sessionStorage.setItem('email', result.email);
                sessionStorage.setItem('skin_type', result.skin_type);
                sessionStorage.setItem('occupation', result.occupation);
                sessionStorage.setItem('exposure_level', result.exposure_level);
                
                window.location.href = 'profile.html';
            } else {
                this.showError(result.error || 'Error en el inicio de sesión');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showError('Error de conexión con el servidor');
        }
    }

    showError(message) {
        this.errorElement.textContent = message;
        this.errorElement.style.display = 'block';
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    new UserViewModel();
});