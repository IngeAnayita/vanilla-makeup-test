document.addEventListener('DOMContentLoaded', function() {
    const skinTypeSelect = document.getElementById('skin-type');
    const exposureSelect = document.getElementById('exposure');
    const generateBtn = document.getElementById('generate-btn');
    const resultsContainer = document.getElementById('recommendation-results');

    // Base de datos de recomendaciones
    const recommendations = {
        mixta: {
            sol: {
                cuidado: [
                    "Gel limpiador suave para equilibrar el sebo (Bioaqua)",
                    "Tónico refrescante sin alcohol (Ruby Rose)",
                    "Hidratante ligero en gel (Dolce Bella)",
                    "Bloqueador: Fluido oil-free con acabado mate y SPF 50+ (Kaba, Bioaqua)"
                ],
                maquillaje: [
                    "Prebase matificante en la zona T y luminosa en el resto (Engol)",
                    "BB Cream con SPF y control de grasa (Ruby Rose)",
                    "Corrector ligero de larga duración (Montoc)",
                    "Polvo compacto translúcido para sellar (Dolce Bella)",
                    "Rubor en polvo suave y natural (Kiss Beauty)",
                    "Máscara de pestañas a prueba de agua (Ushas)",
                    "Spray fijador mate resistente al sudor (Engol)"
                ]
            },
            agua: {
                cuidado: [
                    "Gel limpiador equilibrante (Bioaqua)",
                    "Sérum hidratante con ácido hialurónico (Ruby Rose)",
                    "Hidratante en gel para balancear la piel (Kaba)",
                    "Bloqueador: Resistente al agua, en gel con acabado seco (Bioaqua, Dolce Bella)"
                ],
                maquillaje: [
                    "Prebase waterproof para mayor fijación (Engol)",
                    "Base en polvo compacta resistente al agua (Kaba)",
                    "Corrector cremoso de larga duración (Trendy)",
                    "Rubor en crema de larga duración (Dolce Bella)",
                    "Delineador en gel waterproof (Ushas)",
                    "Labial líquido fijo de 24 h (Kiss Beauty)",
                    "Spray fijador resistente al agua y sudor (Montoc)"
                ]
            },
            ambas: {
                cuidado: [
                    "Espuma limpiadora equilibrante (Bioaqua)",
                    "Sérum hidratante con antioxidantes (Ruby Rose)",
                    "Crema gel para mantener hidratación sin grasa (Kaba)",
                    "Bloqueador: Stick o gel con SPF 50+, resistente al agua y al sudor (Bioaqua, Dolce Bella)"
                ],
                maquillaje: [
                    "Prebase de control de brillo y poros (Engol)",
                    "BB Cream ligera waterproof con FPS (Ruby Rose)",
                    "Corrector ligero pero fijo (Montoc)",
                    "Polvo compacto translúcido resistente al agua (Kaba)",
                    "Rubor en crema o líquido (Dolce Bella)",
                    "Máscara de pestañas waterproof (Ushas)",
                    "Labial en tinta o bálsamo con color (Trendy)",
                    "Spray fijador de larga duración (Engol)"
                ]
            }
        },
        seca: {
            sol: {
                cuidado: [
                    "Crema limpiadora suave (Bioaqua)",
                    "Tónico hidratante sin alcohol (Ruby Rose)",
                    "Crema hidratante rica en ácido hialurónico (Dolce Bella)",
                    "Bloqueador: Crema hidratante con FPS 50+ y antioxidantes (Bioaqua, Kiss Beauty)"
                ],
                maquillaje: [
                    "Prebase hidratante luminosa (Engol)",
                    "Base líquida hidratante con FPS (Ruby Rose)",
                    "Corrector hidratante (Montoc)",
                    "Polvo suelto satinado para sellar (Dolce Bella)",
                    "Rubor en crema para mayor hidratación (Trendy)",
                    "Máscara de pestañas con ingredientes nutritivos (Ushas)",
                    "Bálsamo labial con color y FPS (Kiss Beauty)",
                    "Spray fijador hidratante (Engol)"
                ]
            },
            agua: {
                cuidado: [
                    "Espuma limpiadora hidratante (Bioaqua)",
                    "Sérum con ácido hialurónico y ceramidas (Ruby Rose)",
                    "Crema nutritiva de rápida absorción (Kaba)",
                    "Bloqueador: En gel con acabado hidratante y resistente al agua (Bioaqua)"
                ],
                maquillaje: [
                    "Prebase luminosa waterproof (Engol)",
                    "Base en barra con hidratación (Montoc)",
                    "Corrector cremoso de larga duración (Trendy)",
                    "Iluminador en crema para dar frescura (Ruby Rose)",
                    "Delineador waterproof nutritivo (Ushas)",
                    "Spray fijador con acabado glow (Montoc)"
                ]
            },
            ambas: {
                cuidado: [
                    "Espuma limpiadora hidratante (Bioaqua)",
                    "Sérum nutritivo con antioxidantes (Ruby Rose)",
                    "Crema ligera pero hidratante (Kaba)",
                    "Bloqueador: En barra o gel hidratante con SPF 50+ (Bioaqua, Kiss Beauty)"
                ],
                maquillaje: [
                    "Prebase hidratante pero resistente al agua (Engol)",
                    "BB Cream ligera waterproof con FPS (Ruby Rose)",
                    "Corrector cremoso pero fijo (Montoc)",
                    "Rubor en crema de larga duración (Dolce Bella)",
                    "Labial en tinta con hidratación (Trendy)",
                    "Spray fijador glow pero waterproof (Montoc)"
                ]
            }
        },
        grasa: {
            sol: {
                cuidado: [
                    "Espuma limpiadora control de grasa (Bioaqua)",
                    "Tónico matificante (Ruby Rose)",
                    "Hidratante oil-free (Kaba)",
                    "Bloqueador: Gel oil-free con efecto mate (Bioaqua, Dolce Bella)"
                ],
                maquillaje: [
                    "Prebase matificante (Engol)",
                    "Base en polvo mate con FPS (Kaba)",
                    "Corrector de larga duración (Montoc)",
                    "Polzo compacto matificante (Dolce Bella)",
                    "Spray fijador mate (Engol)"
                ]
            },
            agua: {
                cuidado: [
                    "Espuma limpiadora anti-brillo (Bioaqua)",
                    "Sérum seborregulador (Ruby Rose)",
                    "Hidratante en gel sin aceites (Kaba)",
                    "Bloqueador: Fluido oil-free resistente al agua (Bioaqua)"
                ],
                maquillaje: [
                    "Base en polzo waterproof (Kaba)",
                    "Corrector en barra de alta duración (Montoc)",
                    "Delineador waterproof (Ushas)",
                    "Spray fijador mate waterproof (Engol)"
                ]
            },
            ambas: {
                cuidado: [
                    "Espuma limpiadora control de grasa (Bioaqua)",
                    "Sérum matificante con ácido salicílico (Ruby Rose)",
                    "Hidratante en gel oil-free (Kaba)",
                    "Bloqueador: Gel mate resistente al agua y sudor (Bioaqua)"
                ],
                maquillaje: [
                    "Prebase matificante de larga duración (Engol)",
                    "Base en polzo compacta waterproof (Kaba)",
                    "Corrector en barra mate (Montoc)",
                    "Polzo suelto translúcido (Dolce Bella)",
                    "Spray fijador mate waterproof (Engol)"
                ]
            }
        }
    };

    generateBtn.addEventListener('click', function() {
        const skinType = skinTypeSelect.value;
        const exposure = exposureSelect.value;

        if (!skinType || !exposure) {
            alert('Por favor selecciona tanto tu tipo de piel como nivel de exposición');
            return;
        }

        const skinTypeNames = {
            mixta: 'Piel Mixta',
            seca: 'Piel Seca',
            grasa: 'Piel Grasa'
        };

        const exposureIcons = {
            sol: '🔆',
            agua: '🌊',
            ambas: '🔆🌊'
        };

        const exposureNames = {
            sol: 'Exposición al sol',
            agua: 'Exposición al agua',
            ambas: 'Ambas exposiciones'
        };

        const recData = recommendations[skinType][exposure];

        let html = `
            <div class="recommendation-section">
                <h2>${skinTypeNames[skinType]}</h2>
                <h3>${exposureIcons[exposure]} ${exposureNames[exposure]}</h3>
                
                <div class="care-section">
                    <h3>💆‍♀️ Cuidado de la piel:</h3>
                    <div class="product-list">
                        ${recData.cuidado.map(product => `
                            <div class="product-card">
                                <p class="product-name">${product}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="makeup-section">
                    <h3>💄 Maquillaje:</h3>
                    <div class="product-list">
                        ${recData.maquillaje.map(product => `
                            <div class="product-card">
                                <p class="product-name">${product}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        resultsContainer.innerHTML = html;
    });
});