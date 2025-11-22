// Lógica del Selector de Idioma Custom
    document.addEventListener('DOMContentLoaded', () => {
        const dropdown = document.getElementById('langDropdown');
        const options = dropdown.querySelectorAll('.lang-options li');
        const realSelect = document.getElementById('django-lang-select');
        const form = document.getElementById('lang-form-hidden');

        // 1. Toggle Abrir/Cerrar
        dropdown.addEventListener('click', (e) => {
            dropdown.classList.toggle('open');
            e.stopPropagation();
        });

        // 2. Cerrar si clic fuera
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) dropdown.classList.remove('open');
        });

        // 3. Seleccionar idioma
        options.forEach(option => {
            option.addEventListener('click', () => {
                const langCode = option.getAttribute('data-code');
                realSelect.value = langCode; // Cambiar select oculto
                form.submit(); // Enviar formulario
            });
        });
    });