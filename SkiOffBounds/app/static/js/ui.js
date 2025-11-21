document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Seleccionamos todas las cards
    const cards = document.querySelectorAll('.cards-grid .card');

    // 2. Configuramos el "Ojo" (IntersectionObserver)
    const observerOptions = {
        threshold: 0.15, // Se activa cuando el 15% de la tarjeta es visible
        rootMargin: "0px 0px -50px 0px" // Un pequeño margen para que no salga pegado al borde
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Si la tarjeta entra en pantalla
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Dejamos de observarla para ahorrar recursos (ya se animó una vez)
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // 3. Asignamos la clase inicial y activamos el observador
    cards.forEach((card, index) => {
        // Añadimos la clase base CSS (opacity: 0)
        card.classList.add('animate-on-scroll');
        
        // Le decimos al observador que vigile esta carta
        observer.observe(card);
    });
});
