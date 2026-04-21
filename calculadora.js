function calcularPrecios() {
    const durationInput = document.getElementById('duration-input');
    const duration = parseFloat(durationInput.value) || 0;

    // --- CONFIGURACIÓN DE PRECIOS POR MINUTO ---
    // Dividimos el precio base original (30 y 80) por los 10 minutos originales
    const precioMinutoBasico = 3; 
    const precioMinutoEstandar = 8;

    // --- CÁLCULO ---
    let totalBasico = duration * precioMinutoBasico;
    let totalEstandar = duration * precioMinutoEstandar;

    // --- OPCIONAL: Precio mínimo (para que no te pidan un video de 1 min por 3 USD) ---
    // Si querés un mínimo, por ejemplo 15 USD, descomentá las siguientes dos líneas:
    // if (totalBasico < 15) totalBasico = 15;
    // if (totalEstandar < 40) totalEstandar = 40;

    // --- ACTUALIZAR EL HTML ---
    const displayBasico = document.getElementById('price-basic');
    const displayEstandar = document.getElementById('price-standard');

    if (displayBasico) {
        displayBasico.innerText = `$${totalBasico.toFixed(0)} USD`;
        displayBasico.classList.add('price-anim'); // Animación de pop
        setTimeout(() => displayBasico.classList.remove('price-anim'), 300);
    }

    if (displayEstandar) {
        displayEstandar.innerText = `$${totalEstandar.toFixed(0)} USD`;
        displayEstandar.classList.add('price-anim');
        setTimeout(() => displayEstandar.classList.remove('price-anim'), 300);
    }
}
