document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const chatOutput = document.getElementById('chat-output');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const voiceBtn = document.getElementById('voice-btn');
    const quickQuestions = document.querySelectorAll('.quick-question');
    const suggestions = document.querySelectorAll('.suggestion');
    
    // Base de conocimiento del chatbot
    const knowledgeBase = {
        // Recomendaciones de productos
        "productos para mi tipo de piel": {
            response: (userData) => {
                const skinType = userData?.skinType || 'mixta'; // Valor por defecto si no hay datos
                const products = {
                    'seca': [
                        {
                            name: "Crema Hidratante Intensa Ruby Rose",
                            description: "Con ácido hialurónico y ceramidas para pieles secas",
                            price: "$45.000",
                            image: "../images/productos/hidratante-seca.jpg"
                        },
                        {
                            name: "Base Líquida Hidratante Dolce Bella",
                            description: "Cobertura media con SPF 30, ideal para pieles secas",
                            price: "$52.000",
                            image: "../images/productos/base-seca.jpg"
                        }
                    ],
                    'mixta': [
                        {
                            name: "Gel Hidratante Balance Bioaqua",
                            description: "Hidrata sin engrasar, perfecto para zona T",
                            price: "$38.000",
                            image: "../images/productos/gel-mixta.jpg"
                        },
                        {
                            name: "BB Cream Matte Ruby Rose",
                            description: "Control de brillo con acabado natural",
                            price: "$48.000",
                            image: "../images/productos/bbcream-mixta.jpg"
                        }
                    ],
                    'grasa': [
                        {
                            name: "Sérum Seborregulador Kaba",
                            description: "Controla la producción de sebo durante 12 horas",
                            price: "$55.000",
                            image: "../images/productos/serum-grasa.jpg"
                        },
                        {
                            name: "Polvo Compacto Matte Dolce Bella",
                            description: "Acabado mate sin resecar, ideal para piel grasa",
                            price: "$42.000",
                            image: "../images/productos/polvo-grasa.jpg"
                        }
                    ]
                };
                
                let response = `Para tu piel ${skinType}, te recomiendo estos productos:<br><br>`;
                
                // Crear tarjetas de productos
                products[skinType].forEach(product => {
                    response += `
                        <div class="product-card">
                            <img class="product-image" src="${product.image}" alt="${product.name}">
                            <div class="product-info">
                                <h4 class="product-name">${product.name}</h4>
                                <p class="product-description">${product.description}</p>
                                <p class="product-price">${product.price}</p>
                                <button class="btn-view-product" data-product="${product.name}">Ver producto</button>
                            </div>
                        </div>
                    `;
                });
                
                response += `<br>¿Te gustaría más información sobre alguno de estos productos?`;
                
                return response;
            },
            followUp: true
        },
        
        // Técnicas de aplicación
        "cómo aplicar base correctamente": {
            response: `Para aplicar base correctamente sigue estos pasos:
                <ol>
                    <li><strong>Prepara tu piel:</strong> Limpia e hidrata antes de aplicar maquillaje</li>
                    <li><strong>Elige el producto adecuado:</strong> Según tu tipo de piel (líquida, crema, en polvo)</li>
                    <li><strong>Aplica con herramientas limpias:</strong> Usa esponjas, brochas o dedos limpios</li>
                    <li><strong>Comienza desde el centro:</strong> Difumina hacia afuera</li>
                    <li><strong>Capas ligeras:</strong> Mejor varias capas finas que una gruesa</li>
                    <li><strong>Sella el maquillaje:</strong> Con polvo translúcido para mayor duración</li>
                </ol>
                ¿Quieres que te recomiende productos específicos para tu tipo de piel?`,
            followUp: true
        },
        
        // Consejos de cuidado
        "consejos para piel mixta": {
            response: `Los cuidados esenciales para piel mixta son:
                <ul>
                    <li><strong>Limpieza:</strong> Usa geles limpiadores suaves que no resequen</li>
                    <li><strong>Hidratación:</strong> Aplica cremas ligeras en gel en toda la cara</li>
                    <li><strong>Zona T:</strong> Usa productos matificantes solo en esta área</li>
                    <li><strong>Exfoliación:</strong> 1-2 veces por semana con productos suaves</li>
                    <li><strong>Protección solar:</strong> Elige fórmulas oil-free con SPF 30+</li>
                </ul>
                ¿Te gustaría ver productos específicos para piel mixta?`,
            followUp: true
        },
        
        // Tendencias
        "tendencias 2025": {
            response: `Las tendencias de maquillaje para 2025 incluyen:
                <ul>
                    <li><strong>Skinimalism:</strong> Menos es más, piel sana con poco producto</li>
                    <li><strong>Glow natural:</strong> Brillos sutiles que imitan piel saludable</li>
                    <li><strong>Colores terrosos:</strong> Paletas en tonos tierra y nude</li>
                    <li><strong>Maquillaje multifuncional:</strong> Productos que sirven para varias zonas</li>
                    <li><strong>Bases personalizadas:</strong> Mezclas adaptadas a cada tono de piel</li>
                </ul>
                ¿Quieres recomendaciones de productos para estas tendencias?`,
            followUp: true
        },
        
        // Default
        "default": {
            response: "Disculpa, no entendí tu pregunta. ¿Podrías reformularla? Por ejemplo, puedes preguntar sobre: 'productos para piel seca', 'técnicas de maquillaje' o 'tendencias actuales'.",
            followUp: false
        }
    };
    
    // Datos del usuario (simulados, en producción vendrían del perfil)
    const userData = {
        name: "Usuario",
        skinType: "mixta",
        exposure: "sol"
    };
    
    // Función para mostrar mensaje del usuario
    function displayUserMessage(message) {
        const template = document.getElementById('user-message-template');
        const clone = template.content.cloneNode(true);
        
        clone.querySelector('.message-content').textContent = message;
        clone.querySelector('.message-time').textContent = getCurrentTime();
        
        chatOutput.appendChild(clone);
        scrollToBottom();
    }
    
    // Función para mostrar mensaje del bot
    function displayBotMessage(message, isTyping = false) {
        if (isTyping) {
            // Mostrar indicador de que está escribiendo
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'typing-indicator';
            typingIndicator.innerHTML = `
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            `;
            chatOutput.appendChild(typingIndicator);
            scrollToBottom();
            
            // Eliminar después de mostrar el mensaje real
            return typingIndicator;
        }
        
        const template = document.getElementById('bot-message-template');
        const clone = template.content.cloneNode(true);
        
        clone.querySelector('.message-content').innerHTML = message;
        clone.querySelector('.message-time').textContent = getCurrentTime();
        
        // Manejar botones de like/dislike
        clone.querySelector('.like-btn').addEventListener('click', function() {
            sendFeedback(true, message);
        });
        
        clone.querySelector('.dislike-btn').addEventListener('click', function() {
            sendFeedback(false, message);
        });
        
        chatOutput.appendChild(clone);
        scrollToBottom();
        
        // Manejar clics en productos recomendados
        setTimeout(() => {
            document.querySelectorAll('.btn-view-product').forEach(btn => {
                btn.addEventListener('click', function() {
                    const productName = this.getAttribute('data-product');
                    displayUserMessage(`Quiero más información sobre ${productName}`);
                    setTimeout(() => {
                        displayBotMessage(`El producto ${productName} es perfecto para... [Más detalles]`);
                    }, 1000);
                });
            });
        }, 100);
    }
    
    // Función para obtener hora actual
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Función para desplazar al final del chat
    function scrollToBottom() {
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }
    
    // Función para procesar la pregunta del usuario
    function processQuestion(question) {
        // Convertir a minúsculas y eliminar signos de interrogación
        const cleanQuestion = question.toLowerCase().replace(/[¿?]/g, '');
        
        // Buscar coincidencia en la base de conocimiento
        let bestMatch = null;
        let bestScore = 0;
        
        Object.keys(knowledgeBase).forEach(key => {
            if (cleanQuestion.includes(key)) {
                const score = key.length; // Priorizar coincidencias más largas
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = key;
                }
            }
        });
        
        // Obtener respuesta
        const responseData = bestMatch ? knowledgeBase[bestMatch] : knowledgeBase['default'];
        const response = typeof responseData.response === 'function' ? 
            responseData.response(userData) : 
            responseData.response;
        
        // Mostrar indicador de escritura
        const typingIndicator = displayBotMessage('', true);
        
        // Simular tiempo de respuesta (menos de 3 segundos como requiere el RNF05)
        setTimeout(() => {
            // Eliminar indicador de escritura
            if (typingIndicator) chatOutput.removeChild(typingIndicator);
            
            // Mostrar respuesta
            displayBotMessage(response);
        }, 1500);
    }
    
    // Función para enviar feedback (like/dislike)
    function sendFeedback(isPositive, message) {
        // En producción, esto enviaría datos al servidor
        console.log(`Feedback ${isPositive ? 'positivo' : 'negativo'} para:`, message);
        
        // Mostrar confirmación al usuario
        const feedbackMsg = document.createElement('div');
        feedbackMsg.className = 'feedback-message';
        feedbackMsg.textContent = `¡Gracias por tu feedback!`;
        chatOutput.appendChild(feedbackMsg);
        
        setTimeout(() => {
            feedbackMsg.remove();
        }, 2000);
    }
    
    // Event Listeners
    sendBtn.addEventListener('click', function() {
        const message = chatInput.value.trim();
        if (message) {
            displayUserMessage(message);
            chatInput.value = '';
            processQuestion(message);
        }
    });
    
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });
    
    // Preguntas rápidas
    quickQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const message = this.getAttribute('data-question');
            displayUserMessage(message);
            processQuestion(message);
        });
    });
    
    // Sugerencias
    suggestions.forEach(suggestion => {
        suggestion.addEventListener('click', function() {
            const message = this.textContent;
            displayUserMessage(message);
            processQuestion(message);
        });
    });
    
    // Actualizar hora actual
    function updateCurrentTime() {
        document.getElementById('current-time').textContent = getCurrentTime();
    }
    
    setInterval(updateCurrentTime, 60000);
    updateCurrentTime();
    
    // Reconocimiento de voz (soporte básico)
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'es-ES';
        
        voiceBtn.addEventListener('click', function() {
            recognition.start();
            voiceBtn.innerHTML = '<div class="pulse-ring"></div>';
        });
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            chatInput.value = transcript;
            voiceBtn.innerHTML = '<svg...></svg>'; // Restaurar icono
        };
        
        recognition.onerror = function() {
            voiceBtn.innerHTML = '<svg...></svg>'; // Restaurar icono
        };
    } else {
        voiceBtn.style.display = 'none';
    }
    
    // Mensaje de bienvenida inicial
    setTimeout(() => {
        displayBotMessage(`¡Hola ${userData.name}! Soy tu asistente de maquillaje personal. Puedes preguntarme sobre:
            <ul>
                <li>Productos para tu tipo de piel</li>
                <li>Técnicas de aplicación</li>
                <li>Cuidados específicos</li>
                <li>Tendencias de maquillaje</li>
            </ul>
            ¿En qué puedo ayudarte hoy?`);
    }, 1000);
});

// Agrega al final del archivo ChatbotViewModel.js
module.exports = ChatbotViewModel;
