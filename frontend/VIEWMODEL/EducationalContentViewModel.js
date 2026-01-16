document.addEventListener('DOMContentLoaded', function() {
    // Manejo de pestañas
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase active de todos los botones y contenidos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            // Mostrar el contenido correspondiente
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Cargar contenido educativo basado en el tipo de piel del usuario (si está logueado)
    loadPersonalizedEducationalContent();
    
    // Manejo del formulario de newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const frequency = this.querySelector('select').value;
            
            // Aquí iría la lógica para enviar los datos al servidor
            console.log('Suscripción a newsletter:', { email, frequency });
            
            // Mostrar mensaje de éxito
            alert('¡Gracias por suscribirte! Recibirás consejos personalizados según la frecuencia seleccionada.');
            this.reset();
        });
    }
});

function loadPersonalizedEducationalContent() {
    // Esta función cargaría contenido personalizado basado en el perfil del usuario
    // Por ahora es un mockup, en producción se conectaría a una API o base de datos
    
    // Ejemplo: si el usuario tiene piel mixta, destacar contenido relevante
    const userSkinType = 'mixta'; // Esto vendría del perfil del usuario
    
    // Podríamos marcar contenido relevante para el usuario
    document.querySelectorAll('.educational-card').forEach(card => {
        const skinTypeBadge = card.querySelector('.badge.skin-type');
        if (skinTypeBadge && skinTypeBadge.textContent.toLowerCase().includes(userSkinType)) {
            card.style.borderLeft = '4px solid #b366ff';
            card.style.boxShadow = '0 5px 15px rgba(179, 102, 255, 0.1)';
        }
    });
}