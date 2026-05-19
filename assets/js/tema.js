/**
 * Sistema de Gestión de Temas (Claro/Oscuro)
 * Guarda la preferencia en localStorage y aplica las clases de Tailwind.
 */

const aplicarTema = (tema) => {
    if (tema === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
    } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
    }

    localStorage.setItem('tema-preferido', tema);
    actualizarIconosToggle(tema);
};

const obtenerTemaActual = () => {
    return localStorage.getItem('tema-preferido') || 'light';
};

const actualizarIconosToggle = (tema) => {
    const iconos = document.querySelectorAll('.theme-toggle-icon');

    iconos.forEach(icono => {
        icono.innerText = tema === 'dark'
            ? 'light_mode'
            : 'dark_mode';
    });
};

const toggleTema = () => {
    const nuevoTema =
        document.documentElement.classList.contains('dark')
            ? 'light'
            : 'dark';

    aplicarTema(nuevoTema);
};

// Inicialización inmediata
(() => {
    const tema = localStorage.getItem('tema-preferido') || 'light';

    if (tema === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.add('light');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    actualizarIconosToggle(obtenerTemaActual());
});

window.toggleTema = toggleTema;