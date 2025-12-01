document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.navbar-menu');
    const langSelector = document.querySelector('.nav-item-lang');
    const navbar = document.querySelector('.navbar'); // Seleccionamos el padre

    if (toggleButton && menu && navbar) {
        toggleButton.addEventListener('click', () => {
            // 1. Mostrar/Ocultar enlaces
            menu.classList.toggle('active');
            if (langSelector) langSelector.classList.toggle('active');
            
            // 2. Animar botón
            toggleButton.classList.toggle('open');

            // 3. ¡NUEVO! Marcar el navbar como "abierto" para CSS
            // Esto permite ocultar el título SkiOffBounds vía CSS
            navbar.classList.toggle('menu-open');
        });
    }
});
