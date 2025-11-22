document.addEventListener('DOMContentLoaded', function() {
    
    // --- ELEMENTOS DEL DOM ---
    const realSelect = document.getElementById('filter-localizacion');
    const filterDropdown = document.getElementById('customFilterDropdown');
    const estacionesContainer = document.getElementById('estaciones-container'); // Tu grid de tarjetas
    
    // Si no existen los elementos, no hacemos nada (evita errores en otras páginas)
    if (!realSelect || !filterDropdown || !estacionesContainer) return;

    const selectedDisplay = document.getElementById('filter-selected-text');
    const optionsList = filterDropdown.querySelector('.filter-options');
    const options = optionsList.querySelectorAll('li');

    // --- 1. LÓGICA VISUAL (ABRIR/CERRAR) ---
    filterDropdown.addEventListener('click', function(e) {
        if (!this.classList.contains('open')) {
            const rect = this.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            if (spaceBelow < 300) this.classList.add('open-up');
            else this.classList.remove('open-up');
        }
        this.classList.toggle('open');
        e.stopPropagation();
    });

    document.addEventListener('click', function(e) {
        if (!filterDropdown.contains(e.target)) {
            filterDropdown.classList.remove('open');
        }
    });

    // --- 2. LÓGICA DE SELECCIÓN Y FILTRADO ---
    options.forEach(option => {
        option.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            const text = this.innerText;

            // A) Actualizar Visual
            selectedDisplay.innerText = text;
            options.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // B) Actualizar Select Oculto (por si acaso se envía en un form)
            realSelect.value = value;

            // C) LLAMAR DIRECTAMENTE A LA FUNCIÓN DE FILTRADO
            console.log("Filtrando por localización ID:", value);
            ejecutarFiltro(value); 
        });
    });

    // --- 3. FUNCIÓN DE FILTRADO (AJAX/FETCH) ---
    function ejecutarFiltro(localizacionId) {
        // URL de tu API (Ajusta esto según tu urls.py)
        // Si filtras por query string (?loc=1) o por URL limpia (api/1/)
        let url = `/api/estaciones/`; 
        
        if (localizacionId) {
            url += `?localizacion=${localizacionId}`;
        }

        // Efecto visual de carga
        estacionesContainer.style.opacity = '0.5';

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Error en la red');
                return response.json();
            })
            .then(data => {
                // Renderizar las nuevas tarjetas
                actualizarGridEstaciones(data);
                estacionesContainer.style.opacity = '1';
            })
            .catch(error => {
                console.error('Error al filtrar:', error);
                estacionesContainer.style.opacity = '1';
            });
    }

    // --- 4. FUNCIÓN PARA DIBUJAR EL HTML (RENDER) ---
    // Adapta este HTML al diseño exacto de tus tarjetas
    function actualizarGridEstaciones(estaciones) {
        estacionesContainer.innerHTML = '';

        if (estaciones.length === 0) {
            estacionesContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon"><i class="bi bi-search"></i></div>
                    <h3>No se encontraron estaciones</h3>
                    <p>Prueba con otra localización.</p>
                </div>`;
            return;
        }

        estaciones.forEach(est => {
            // Construir la tarjeta HTML. 
            // NOTA: Asegúrate de que tu API devuelve todos estos campos (nombre, imagen, precio...)
            const imagenStyle = est.imagen_portada ? `style="--bg-image: url('${est.imagen_portada}');"` : '';
            
            const cardHTML = `
                <div class="card animate-on-scroll" ${imagenStyle}>
                    <div class="card-overlay"></div>
                    <div class="card-content">
                        <h3 class="card-title">${est.nombre}</h3>
                        <p class="card-location">${est.localizacion_nombre || ''}</p>
                        
                        <div class="card-stats">
                            <div class="stat">
                                <i class="bi bi-graph-up"></i>
                                <span>${est.km_pistas_totales} km</span>
                            </div>
                            <div class="stat">
                                <i class="bi bi-arrow-up"></i>
                                <span>${est.altitud_minima}-${est.altitud_maxima} m</span>
                            </div>
                        </div>

                        ${est.precio ? `
                        <div class="card-price">
                            <span class="price-label">Desde</span>
                            <span class="price-value">${est.precio}€</span>
                        </div>` : ''}

                        <div class="card-actions">
                            <a href="/estacion/${est.id}/" class="card-link">Ver Detalles</a>
                        </div>
                    </div>
                </div>
            `;
            estacionesContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    }
});
