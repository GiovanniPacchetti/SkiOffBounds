document.addEventListener('DOMContentLoaded', function() {
    const badges = document.querySelectorAll('.live-status');

    badges.forEach(container => {
        const badge = container.querySelector('.status-badge');
        const details = container.querySelector('.status-details');
        const id = container.dataset.id;
        
        // Evento: Al pasar el ratón por encima (hover)
        container.addEventListener('mouseenter', function() {
            // Si ya tenemos datos cargados, no volver a pedir
            if (container.classList.contains('loaded')) return;

            // status.js
            const loadingText = gettext('Cargando...'); // Asegúrate de tener cargado el catálogo JS
            badge.innerHTML = `<i class="bi bi-arrow-repeat spin"></i> ${loadingText}`;

            fetch(`/home/api/estacion/${id}/estado/`)
                .then(response => response.json())
                .then(data => {
                    // Definir color según estado
                    let colorClass = 'text-success'; // Verde
                    if (data.estado === 'Cerrada') colorClass = 'text-danger'; // Rojo
                    if (data.estado === 'Parcial') colorClass = 'text-warning'; // Naranja

                    // Inyectar HTML
                    details.innerHTML = `
                        <div class="status-row ${colorClass}">
                            <strong>${data.estado}</strong>
                        </div>
                        <div class="status-row">
                            <span><i class="bi ${data.icono_clima}"></i> ${data.temperatura}</span>
                            <span><i class="bi bi-snow"></i> ${data.espesor}</span>
                        </div>
                    `;
                    
                    // Mostrar detalles y ocultar botón inicial
                    badge.style.display = 'none';
                    details.style.display = 'block';
                    details.classList.add('fade-in');
                    
                    // Marcar como cargado para no repetir la petición
                    container.classList.add('loaded');
                })
                .catch(error => {
                    badge.innerHTML = '<i class="bi bi-x-circle"></i> Error';
                });
        });
    });
});
