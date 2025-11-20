document.addEventListener('DOMContentLoaded', function() {
    const cardsGrid = document.querySelector('.cards-grid');
    
    if (cardsGrid) {
        const cards = cardsGrid.querySelectorAll('.card');
        
        function updateCardAnimations() {
            cards.forEach((card, index) => {
                
                if (index >= 0) {
                    card.classList.add('animate-on-scroll');
                    card.classList.remove('visible'); // Forzamos que empiece invisible si no está en pantalla
                } else {
                    // El índice 0 (la primera carta) siempre visible y sin animación de scroll
                    card.classList.remove('animate-on-scroll');
                    card.classList.add('visible'); 
                }
            });
            
            // Chequeamos inmediatamente por si las segundas ya están en pantalla
            checkScrollVisibility();
        }
        
        function checkScrollVisibility() {
            const animatedCards = document.querySelectorAll('.card.animate-on-scroll');
            const triggerBottom = window.innerHeight * 0.85;

            animatedCards.forEach(card => {
                const cardTop = card.getBoundingClientRect().top;
                if (cardTop < triggerBottom) {
                    card.classList.add('visible');
                }
            });
        }
        
        // Inicializar
        updateCardAnimations();
        
        // Listeners
        // Ya no necesitamos 'resize' para recalcular filas, pero está bien dejarlo por si acaso
        window.addEventListener('scroll', checkScrollVisibility);
    }
});
