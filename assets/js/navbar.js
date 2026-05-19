const cargarNavbar = async () => {
    const contenedor = document.getElementById('navbar-contenedor');
    if (!contenedor) return;

    try {
        const respuesta = await fetch('navbar.html');
        let html = await respuesta.text();

        if (typeof configuracionLocal !== 'undefined') {
            html = html.replace(/assets\/img\/logo\.png/g, configuracionLocal.logo);
            html = html.replace(/Panchería/g, configuracionLocal.nombre);
        }

        contenedor.innerHTML = html;

        configurarNavActiva();
        configurarThemeToggles();
        
        // Inicializar el fix de altura para Chrome iOS
        ajustarAlturaViewport();

    } catch (error) {
        console.error('Error cargando navbar:', error);
    }
};

/**
 * Solución para el dynamic viewport en Chrome iOS.
 * Aunque CSS dvh ayuda, Chrome iOS a veces necesita un empujón para recalcular
 * correctamente la posición de elementos fixed durante el scroll.
 */
const ajustarAlturaViewport = () => {
    const mobileNav = document.getElementById('mobile-bottom-nav');

    if (!mobileNav) return;

    const actualizarPosicion = () => {
        mobileNav.style.bottom = '0px';
    };

    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', actualizarPosicion);
        window.visualViewport.addEventListener('scroll', actualizarPosicion);
    }

    window.addEventListener('resize', actualizarPosicion);
    actualizarPosicion();
};

const configurarThemeToggles = () => {
    const btnPc = document.getElementById('theme-toggle-pc');
    const btnMobile = document.getElementById('theme-toggle-mobile');

    const handleToggle = () => {
        if (typeof toggleTema === 'function') {
            toggleTema();
        }
    };

    if (btnPc) btnPc.addEventListener('click', handleToggle);
    if (btnMobile) btnMobile.addEventListener('click', handleToggle);
};

const configurarNavActiva = () => {
    const links = document.querySelectorAll('.nav-link, .nav-mobile-link');
    const currentPath = window.location.pathname;

    links.forEach(link => {
        const href = link.getAttribute('href');

        if (currentPath.includes(href) && href !== 'index.html#inicio') {
            link.classList.add('text-red-600');
            link.classList.remove('text-slate-600', 'text-slate-400');
        }
    });
};

document.addEventListener('DOMContentLoaded', cargarNavbar);
