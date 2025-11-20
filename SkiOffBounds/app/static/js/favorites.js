document.addEventListener('DOMContentLoaded', function() {
    // Event delegation para botones (incluso los creados dinámicamente)
    document.body.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn-favorito');
        if (btn) {
            e.preventDefault();
            const estacionId = parseInt(btn.dataset.estacionId);
            toggleFavorito(estacionId);
        }
    });

    // Inicializar iconos
    actualizarIconosFavoritos();
    
    // Escuchar cuando el filtro AJAX actualice el contenido
    document.addEventListener('contentUpdated', actualizarIconosFavoritos);
});

function toggleFavorito(estacionId) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    const index = favoritos.indexOf(estacionId);
    
    if (index === -1) {
        favoritos.push(estacionId);
        mostrarNotificacion(`⭐ ${gettext('Añadido a favoritos')}`);
    } else {
        favoritos.splice(index, 1);
        mostrarNotificacion(gettext('Eliminado de favoritos'));
    }
    
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    actualizarIconosFavoritos();
}

function actualizarIconosFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    document.querySelectorAll('.btn-favorito').forEach(btn => {
        const id = parseInt(btn.dataset.estacionId);
        if (favoritos.includes(id)) {
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
