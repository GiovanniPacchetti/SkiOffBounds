// Función global para inicializar el estado (se puede llamar varias veces)
window.inicializarEstadoEnVivo = function() {
    const badges = document.querySelectorAll('.live-status');

    badges.forEach(container => {
        // ¡IMPORTANTE! Si ya lo hemos inicializado, nos lo saltamos
        if (container.dataset.init === "true") return;
        
        // Marcamos como inicializado
        container.dataset.init = "true";

        const badge = container.querySelector('.status-badge');
        const details = container.querySelector('.status-details');
        const id = container.dataset.id;
        
        // Evento: Al pasar el ratón por encima (hover)
        container.addEventListener('mouseenter', function() {
            // Si ya tenemos datos cargados, no volver a pedir
            if (container.classList.contains('loaded')) return;

            const loadingText = gettext('Cargando...'); 
            badge.innerHTML = `<i class="bi bi-arrow-repeat spin"></i> ${loadingText}`;

            fetch(`/home/api/estacion/${id}/estado/`)
                .then(response => response.json())
                .then(data => {
                    let colorClass = 'text-success'; 
                    if (data.estado === 'Cerrada') colorClass = 'text-danger'; 
                    if (data.estado === 'Parcial') colorClass = 'text-warning'; 

                    details.innerHTML = `
                        <div class="status-row ${colorClass}">
                            <strong>${data.estado}</strong>
                        </div>
                        <div class="status-row">
                            <span><i class="bi ${data.icono_clima}"></i> ${data.temperatura}</span>
                            <span><i class="bi bi-snow"></i> ${data.espesor}</span>
                        </div>
                    `;
                    
                    badge.style.display = 'none';
                    details.style.display = 'block';
                    details.classList.add('fade-in');
                    
                    container.classList.add('loaded');
                })
                .catch(error => {
                    console.error(error);
                    badge.innerHTML = '<i class="bi bi-x-circle"></i> Error';
                });
        });
    });
};

// Ejecutar automáticamente al cargar la página por primera vez
document.addEventListener('DOMContentLoaded', window.inicializarEstadoEnVivo);
