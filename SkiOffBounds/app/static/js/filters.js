document.addEventListener('DOMContentLoaded', function() {
    const filterSelect = document.getElementById('filter-localizacion');
    
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            const locId = this.value;
            const container = document.getElementById('estaciones-container');
            const loadingMsg = gettext('Cargando estaciones...');
            
            container.innerHTML = `<div class="loading"><i class="bi bi-hourglass-split"></i> ${loadingMsg}</div>`;
            
            fetch(`/home/api/filter/?loc=${locId}`)
                .then(response => response.json())
                .then(data => displayFilteredEstaciones(data))
                .catch(error => {
                    const errorMsg = gettext('Error al cargar estaciones');
                    container.innerHTML = `<div class="error"><i class="bi bi-x-circle"></i> ${errorMsg}</div>`;
                });
        });
    }

    function displayFilteredEstaciones(estaciones) {
        const container = document.getElementById('estaciones-container');
        container.innerHTML = '';
        
        if (estaciones.length === 0) {
            const noStationsMsg = gettext('No hay estaciones en esta localización');
            container.innerHTML = `<p class="no-results"><i class="bi bi-inbox"></i> ${noStationsMsg}</p>`;
            return;
        }
        
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
                        <div class="stat"><i class="bi bi-graph-up"></i><span>${est.km_pistas} km</span></div>
                    </div>
                    <div class="card-actions">
                        <a href="${est.url}" class="card-link">${detailsText}</a>
                        <button class="btn-favorito" data-estacion-id="${est.id}" title="${addFavText}">
                            <i class="bi bi-star"></i>
                        </button>
                    </div>
                </div>`;
            container.appendChild(card);
        });
        
        // Disparar evento para que favoritos.js actualice los iconos nuevos
        document.dispatchEvent(new Event('contentUpdated'));
    }
});
