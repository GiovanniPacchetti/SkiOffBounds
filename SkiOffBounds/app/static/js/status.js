window.inicializarEstadoEnVivo = function() {
    const badges = document.querySelectorAll('.live-status');

    badges.forEach(container => {
        if (container.dataset.init === "true") return;
        container.dataset.init = "true";

        const badge = container.querySelector('.status-badge');
        const details = container.querySelector('.status-details');
        const id = container.dataset.id;
        
        container.addEventListener('mouseenter', function() {
            if (container.classList.contains('loaded')) return;

            const loadingText = gettext('Cargando...'); 
            badge.innerHTML = `<i class="bi bi-arrow-repeat spin"></i> ${loadingText}`;

            fetch(`/home/api/estacion/${id}/estado/`)
                .then(response => response.json())
                .then(data => {
                    let colorClass = 'text-success'; // Verde por defecto (open)
                    
                  
                    if (data.estado_code === 'closed') {
                        colorClass = 'text-danger'; 
                    } else if (data.estado_code === 'partial') {
                        colorClass = 'text-warning'; 
                    }

                    details.innerHTML = `
                        <div class="status-row ${colorClass}">
                            <!-- Mostramos el texto traducido que preparó Python -->
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
                    const errorText = gettext('Error');
                    badge.innerHTML = `<i class="bi bi-x-circle"></i> ${errorText}`;
                });
        });
    });
};

document.addEventListener('DOMContentLoaded', window.inicializarEstadoEnVivo);
