// Lógica de la calculadora de precios
function calcularPrecios() {
    // 1. Obtener los minutos que puso el usuario
    let minutes = parseInt(document.getElementById('duration-input').value);

    // Si el campo está vacío o es menor a 1, asumimos 1 minuto
    if (isNaN(minutes) || minutes < 1) minutes = 1;

    // 2. Definir los precios Base y el costo por Minuto Extra
    // Estructura: [PrecioBase, CostoExtra]
    const plans = {
        'price-basic':    { base: 30,  extra: 3 },
        'price-standard': { base: 80,  extra: 6 },
        'price-advanced': { base: 100, extra: 8 }
    };

    // 3. Calcular la diferencia (Solo cobramos extra si pasa de 10 min)
    let extraMinutes = 0;
    if (minutes > 10) {
        extraMinutes = minutes - 10;
    }

    // 4. Actualizar cada tarjeta
    for (let [id, plan] of Object.entries(plans)) {
        let finalPrice = plan.base + (extraMinutes * plan.extra);
        
        let priceElement = document.getElementById(id);
        
        // Actualizar el texto
        priceElement.innerText = `$${finalPrice} USD`;
        
        // Efecto visual de "Pop" para que se note el cambio
        priceElement.classList.remove('price-anim');
        void priceElement.offsetWidth; // Truco para reiniciar animación CSS
        priceElement.classList.add('price-anim');
    }
}