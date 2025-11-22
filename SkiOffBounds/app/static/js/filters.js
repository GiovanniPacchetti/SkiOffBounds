document.addEventListener('DOMContentLoaded', function() {
    
    // ELEMENTOS
    const filterDropdown = document.getElementById('customFilterDropdown');
    const estacionesContainer = document.getElementById('estaciones-container');
    const selectedDisplay = document.getElementById('filter-selected-text');
    
    if (!filterDropdown || !estacionesContainer) return;

    const API_URL = filterDropdown.getAttribute('data-api-url');

    // 1. VISUAL: ABRIR/CERRAR
    filterDropdown.addEventListener('click', function(e) {
        if (!this.classList.contains('open')) {
            const rect = this.getBoundingClientRect();
            if (window.innerHeight - rect.bottom < 300) this.classList.add('open-up');
            else this.classList.remove('open-up');
        }
        this.classList.toggle('open');
        e.stopPropagation();
    });

    document.addEventListener('click', function(e) {
        if (!filterDropdown.contains(e.target)) filterDropdown.classList.remove('open');
    });

    // 2. SELECCIONAR OPCIÓN
    filterDropdown.querySelectorAll('.filter-options li').forEach(option => {
        option.addEventListener('click', function() {
            const locId = this.getAttribute('data-value');
            const locName = this.innerText;

            selectedDisplay.innerText = locName;
            this.parentElement.querySelectorAll('li').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');

            filtrarPorServidor(locId);
        });
    });

    // 3. AJAX
    function filtrarPorServidor(locId) {
        const url = `${API_URL}?loc=${locId}`;
        estacionesContainer.style.opacity = '0.5';

        fetch(url)
            .then(r => r.json())
            .then(data => {
                pintarTarjetas(data);
                estacionesContainer.style.opacity = '1';
            })
            .catch(err => {
                console.error(err);
                estacionesContainer.style.opacity = '1';
            });
    }

    // 4. RENDERIZADO (Corregido datos undefined)
    function pintarTarjetas(estaciones) {
        estacionesContainer.innerHTML = '';

        if (estaciones.length === 0) {
            estacionesContainer.innerHTML = `<div class="empty-state" style="grid-column:1/-1;text-align:center;padding:40px;color:#666;"><h3>No hay resultados</h3></div>`;
            return;
        }

        estaciones.forEach(est => {
            const styleBg = est.imagen_url ? `style="--bg-image: url('${est.imagen_url}');"` : '';
            
            // Arreglamos lo de "UNDEFINED" y "Altitud"
            const altitudHTML = (est.altitud_min && est.altitud_max) 
                ? `${est.altitud_min} - ${est.altitud_max} m` 
                : 'N/D';

            const html = `
            <div class="card animate-on-scroll visible" ${styleBg}>
                <div class="card-overlay"></div>
                <div class="card-content">
                    <h3 class="card-title">${est.nombre}</h3>
                    <!-- Aquí arreglamos el UNDEFINED -->
                    <p class="card-location">${est.localizacion}</p> 
                    
                    <div class="card-stats">
                        <div class="stat">
                            <i class="bi bi-graph-up"></i>
                            <span>${est.km_pistas} km</span>
                        </div>
                        <div class="stat">
                            <i class="bi bi-arrow-up"></i>
                            <!-- Aquí arreglamos el texto estático -->
                            <span>${altitudHTML}</span> 
                        </div>
                    </div>

                    <div class="card-actions">
                        <a href="${est.url}" class="card-link">Ver Detalles</a>
                         <button class="btn-favorito" data-estacion-id="${est.id}"><i class="bi bi-star"></i></button>
                    </div>
                    
                    <div class="live-status" data-id="${est.id}">
                        <span class="status-badge pending">
                            <i class="bi bi-activity"></i> Consultar estado
                        </span>
                        <div class="status-details" style="display: none;"></div>
                    </div>
                </div>
            </div>`;
            estacionesContainer.insertAdjacentHTML('beforeend', html);
        });

        // ======================================================
        // ESTA ES LA CLAVE: Reactivar tu código de 'status.js'
        // ======================================================
        if (typeof window.inicializarEstadoEnVivo === 'function') {
            window.inicializarEstadoEnVivo();
        } else {
            // Si tu función no es global, dispara un evento custom
            document.dispatchEvent(new Event('contenido-actualizado'));
        }
    }
});
