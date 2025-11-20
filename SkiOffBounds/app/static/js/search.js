// Búsqueda en tiempo real de estaciones
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-estaciones');
    const searchResults = document.getElementById('search-results');
    const filterSelect = document.getElementById('filter-localizacion');
    let searchTimeout;

    // Búsqueda AJAX con debounce
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length < 2) {
                searchResults.innerHTML = '';
                searchResults.style.display = 'none';
                return;
            }
            
            searchTimeout = setTimeout(() => {
                fetch(`/home/api/search/?q=${encodeURIComponent(query)}`)
                    .then(response => response.json())
                    .then(data => {
                        displaySearchResults(data);
                    })
                    .catch(error => {
                        console.error('Error en búsqueda:', error);
                        // TRADUCCIÓN: gettext
                        const errorMsg = gettext('Error al buscar');
                        searchResults.innerHTML = `<div class="search-error"><i class="bi bi-exclamation-triangle"></i> ${errorMsg}</div>`;
                        searchResults.style.display = 'block';
                    });
            }, 300);
        });
        
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
        
        searchInput.addEventListener('focus', function() {
            if (searchResults.children.length > 0) {
                searchResults.style.display = 'block';
            }
        });
    }
    
    // Filtro por localización
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            const locId = this.value;
            const container = document.getElementById('estaciones-container');
            
            // TRADUCCIÓN: gettext
            const loadingMsg = gettext('Cargando estaciones...');
            container.innerHTML = `<div class="loading"><i class="bi bi-hourglass-split"></i> ${loadingMsg}</div>`;
            
            fetch(`/home/api/filter/?loc=${locId}`)
                .then(response => response.json())
                .then(data => {
                    displayFilteredEstaciones(data);
                })
                .catch(error => {
                    console.error('Error al filtrar:', error);
                    // TRADUCCIÓN: gettext
                    const errorMsg = gettext('Error al cargar estaciones');
                    container.innerHTML = `<div class="error"><i class="bi bi-x-circle"></i> ${errorMsg}</div>`;
                });
        });
    }
    
    // ========== MANEJO DE FAVORITOS CON EVENT DELEGATION ==========
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn-favorito');
        if (btn) {
            e.preventDefault();
            const estacionId = parseInt(btn.dataset.estacionId);
            toggleFavorito(estacionId);
        }
    });
    
    function displaySearchResults(estaciones) {
        searchResults.innerHTML = '';
        
        if (estaciones.length === 0) {
            // TRADUCCIÓN: gettext
            const noResultsMsg = gettext('No se encontraron resultados');
            searchResults.innerHTML = `<div class="search-no-results"><i class="bi bi-info-circle"></i> ${noResultsMsg}</div>`;
            searchResults.style.display = 'block';
            return;
        }
        
        estaciones.forEach(est => {
            const item = document.createElement('a');
            item.className = 'search-result-item';
            item.href = est.url;
            item.innerHTML = `
                <div class="search-item-content">
                    <i class="bi bi-geo-alt-fill"></i>
                    <div class="search-item-info">
                        <strong>${est.nombre}</strong>
                        <small>${est.localizacion} • ${est.km_pistas} km</small>
                    </div>
                </div>
            `;
            searchResults.appendChild(item);
        });
        
        searchResults.style.display = 'block';
    }
    
    function displayFilteredEstaciones(estaciones) {
        const container = document.getElementById('estaciones-container');
        container.innerHTML = '';
        
        if (estaciones.length === 0) {
            // TRADUCCIÓN: gettext
            const noStationsMsg = gettext('No hay estaciones en esta localización');
            container.innerHTML = `<p class="no-results"><i class="bi bi-inbox"></i> ${noStationsMsg}</p>`;
            return;
        }
        
        // Textos traducibles para usar dentro del bucle si fuera necesario
        const detailsText = gettext('Ver Detalles');
        const addFavText = gettext('Añadir a favoritos');

        estaciones.forEach(est => {
            const card = document.createElement('div');
            card.className = 'card fade-in';
            card.innerHTML = `
                <div class="card-overlay"></div>
                <div class="card-content">
                    <h3 class="card-title">${est.nombre}</h3>
                    <p class="card-location">${est.localizacion}</p>
                    
                    <div class="card-stats">
                        <div class="stat">
                            <i class="bi bi-graph-up"></i>
                            <span>${est.km_pistas} km</span>
                        </div>
                    </div>
                    
                    <div class="card-actions">
                        <a href="${est.url}" class="card-link">${detailsText}</a>
                        <button class="btn-favorito" data-estacion-id="${est.id}" title="${addFavText}">
                            <i class="bi bi-star"></i>
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
        
        actualizarIconosFavoritos();
    }
    
    // ========== ANIMACIÓN DE CARDS AL SCROLL ==========
    const cardsGrid = document.querySelector('.cards-grid');
    
    if (cardsGrid) {
        const cards = cardsGrid.querySelectorAll('.card');
        
        function getCardsPerRow() {
            if (window.innerWidth > 1024) return 3;
            if (window.innerWidth > 768) return 2;
            return 1;
        }
        
        function updateCardAnimations() {
            const cardsPerRow = getCardsPerRow();
            
            cards.forEach((card, index) => {
                if (index >= cardsPerRow) {
                    card.classList.add('animate-on-scroll');
                } else {
                    card.classList.remove('animate-on-scroll');
                }
            });
            
            window.dispatchEvent(new Event('scroll'));
        }
        
        updateCardAnimations();
        window.addEventListener('resize', updateCardAnimations);
    }
    
    actualizarIconosFavoritos();
});

// ========== SISTEMA DE FAVORITOS ==========
function toggleFavorito(estacionId) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    const index = favoritos.indexOf(estacionId);
    const btn = document.querySelector(`[data-estacion-id="${estacionId}"]`);
    
    if (index === -1) {
        favoritos.push(estacionId);
        if (btn) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="bi bi-star-fill"></i>';
        }
        // TRADUCCIÓN: gettext
        mostrarNotificacion(`⭐ ${gettext('Añadido a favoritos')}`);
    } else {
        favoritos.splice(index, 1);
        if (btn) {
            btn.classList.remove('active');
            btn.innerHTML = '<i class="bi bi-star"></i>';
        }
        // TRADUCCIÓN: gettext
        mostrarNotificacion(gettext('Eliminado de favoritos'));
    }
    
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

function actualizarIconosFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    document.querySelectorAll('.btn-favorito').forEach(btn => {
        const estacionId = parseInt(btn.dataset.estacionId);
        if (favoritos.includes(estacionId)) {
            btn.innerHTML = '<i class="bi bi-star-fill"></i>';
            btn.classList.add('active');
        } else {
            btn.innerHTML = '<i class="bi bi-star"></i>';
            btn.classList.remove('active');
        }
    });
}

function mostrarNotificacion(mensaje) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = mensaje;
    document.body.appendChild(notif);
    
    setTimeout(() => notif.classList.add('show'), 100);
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 300);
    }, 2000);
}

window.addEventListener('scroll', function() {
    const cards = document.querySelectorAll('.card.animate-on-scroll');
    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (cardTop < windowHeight - 100) {
            card.classList.add('visible');
        }
    });
});
