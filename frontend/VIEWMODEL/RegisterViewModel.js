class RegisterViewModel {
    constructor() {
        this.registerForm = document.getElementById('register-form');
        this.errorMessage = document.getElementById('error-message');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.registerForm.addEventListener('submit', (event) => this.handleRegister(event));
    }

    async handleRegister(event) {
        event.preventDefault();

        const userData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            skin_type: document.getElementById('skin_type').value,
            occupation: document.getElementById('occupation').value,
            exposure_level: document.getElementById('exposure_level').value,
        };

        try {
            const response = await fetch('../PHP/user_controller.php?action=register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (data.success) {
                alert('Registro exitoso');
                window.location.href = 'login.html'; // Redirige al login
            } else {
                this.showError('Error en el registro. Inténtalo de nuevo.');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showError('Error de conexión. Inténtalo más tarde.');
        }
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
    }
}

// Inicializar el ViewModel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new RegisterViewModel();
});