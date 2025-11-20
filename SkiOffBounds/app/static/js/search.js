document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-estaciones');
    const searchResults = document.getElementById('search-results');
    let searchTimeout;

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
                    .then(data => displaySearchResults(data))
                    .catch(error => {
                        console.error('Error:', error);
                        const errorMsg = gettext('Error al buscar');
                        searchResults.innerHTML = `<div class="search-error"><i class="bi bi-exclamation-triangle"></i> ${errorMsg}</div>`;
                        searchResults.style.display = 'block';
                    });
            }, 300);
        });
        
        // Cerrar resultados al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }

    function displaySearchResults(estaciones) {
        searchResults.innerHTML = '';
        if (estaciones.length === 0) {
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
                    <div class="search-item-info">
                        <strong>${est.nombre}</strong>
                        <small>${est.localizacion} • ${est.km_pistas} km</small>
                    </div>
                    <i class="bi bi-geo-alt-fill"></i>

                </div>`;
            searchResults.appendChild(item);
        });
        searchResults.style.display = 'block';
    }
});
