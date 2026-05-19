let categoriaSeleccionada = 'Todo';

const mostrarToast = (mensaje) => {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `<span class="material-symbols-outlined text-[20px] text-green-400">check_circle</span> ${mensaje}`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-fade-out');

        setTimeout(() => toast.remove(), 500);
    }, 3000);
};

const productoTienePersonalizacion = (producto) => {
    return (producto.extras && producto.extras.length > 0) ||
        (producto.ingredientesRemovibles && producto.ingredientesRemovibles.length > 0);
};

const manejarAgregarClick = (id) => {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    if (productoTienePersonalizacion(producto)) {
        abrirModalExtras(producto);
    } else {
        actualizarCantidad(id, 1);
    }
};

const actualizarCantidad = (id, cambio) => {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    const cantidadAntes = obtenerCantidad(id);

    agregarOActualizarProducto(producto, cambio);

    const cantidadDespues = obtenerCantidad(id);

    if (cambio > 0 && cantidadAntes === 0 && cantidadDespues > 0) {
        mostrarToast('Producto agregado al carrito');
    }

    actualizarInterfaz();
};

const abrirDetalleProducto = (id) => {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    const modalHTML = `
        <div id="modal-detalle-producto" class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
            <div class="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom-8 duration-500">
                
                <div class="relative h-72 overflow-hidden">
                    <img 
                        src="${producto.imagen}" 
                        alt="${producto.nombre}"
                        class="w-full h-full object-cover"
                    >

                    <button 
                        onclick="cerrarDetalleProducto()"
                        class="absolute top-4 right-4 w-11 h-11 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-all"
                    >
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div class="p-6 md:p-8">
                    <div class="mb-6">
                        <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-3">
                            ${producto.nombre}
                        </h2>

                        <p class="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                            ${producto.descripcion}
                        </p>
                    </div>

                    <div class="flex items-center justify-between gap-4">
                        <span class="text-4xl font-black text-primary">
                            $${producto.precio}
                        </span>

                        <button
                            onclick="continuarPersonalizacion('${producto.id}')"
                            class="bg-primary hover:bg-red-700 text-white px-6 py-4 rounded-2xl font-bold transition-all active:scale-95 flex items-center gap-2"
                        >
                            <span class="material-symbols-outlined">
                                shopping_cart
                            </span>

                            Agregar / Personalizar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
};

const cerrarDetalleProducto = () => {
    const modal = document.getElementById('modal-detalle-producto');

    if (modal) {
        modal.remove();
    }

    document.body.style.overflow = '';
};

const continuarPersonalizacion = (id) => {
    cerrarDetalleProducto();

    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    if (productoTienePersonalizacion(producto)) {
        abrirModalExtras(producto);
    } else {
        actualizarCantidad(id, 1);
    }
};

const actualizarInterfaz = () => {
    productos.forEach(producto => {
        const cantidad = obtenerCantidad(producto.id);

        const botonAgregar = document.getElementById(`add-btn-${producto.id}`);
        const selector = document.getElementById(`selector-${producto.id}`);
        const cantidadTexto = document.getElementById(`qty-${producto.id}`);

        if (cantidad > 0) {
            if (botonAgregar) botonAgregar.classList.add('hidden-btn');
            if (selector) selector.classList.add('active');
            if (cantidadTexto) cantidadTexto.innerText = cantidad;
        } else {
            if (botonAgregar) botonAgregar.classList.remove('hidden-btn');
            if (selector) selector.classList.remove('active');
        }
    });

    const barraCarrito = document.getElementById('floating-cart');
    const cantidadItems = document.getElementById('cart-item-count');
    const totalCarrito = document.getElementById('cart-total');

    if (!barraCarrito || !cantidadItems || !totalCarrito) return;

    const totalItems = carrito.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrecio = carrito.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (totalItems > 0) {
        barraCarrito.classList.remove(
            'translate-y-[150%]',
            'opacity-0',
            'invisible'
        );

        barraCarrito.classList.add(
            'translate-y-0',
            'opacity-100',
            'visible'
        );

        cantidadItems.innerText = `${totalItems} ítem${totalItems !== 1 ? 's' : ''}`;
        totalCarrito.innerText = `$${totalPrecio}`;
    } else {
        barraCarrito.classList.remove(
            'translate-y-0',
            'opacity-100',
            'visible'
        );

        barraCarrito.classList.add(
            'translate-y-[150%]',
            'opacity-0',
            'invisible'
        );
    }
};

const quitarUnaUnidadProducto = (id) => {
    cargarCarrito();

    const index = carrito.findIndex(item => item.id === id);

    if (index === -1) return;

    carrito[index].quantity -= 1;

    if (carrito[index].quantity <= 0) {
        carrito.splice(index, 1);
    }

    guardarCarrito();
    actualizarInterfaz();
};

const filtrarPorCategoria = (categoria) => {
    categoriaSeleccionada = categoria;

    renderizarCategorias();
    renderizarMenu();
    actualizarInterfaz();
};

const renderizarCategorias = () => {
    const contenedor = document.getElementById('category-filters');
    if (!contenedor) return;

    const categorias = ['Todo', ...new Set(productos.map(p => p.categoria).filter(Boolean))];

    contenedor.innerHTML = `
        <div class="mb-2 md:hidden flex items-center gap-1.5 text-slate-400">
            <span class="material-symbols-outlined text-[16px] animate-pulse">swipe_left</span>
            <span class="text-[11px] font-bold uppercase tracking-wider">
                Deslizá para ver más
            </span>
        </div>

        <div class="relative group">
            <div id="categorias-scroll" class="flex gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x">
                ${categorias.map(cat => {
                    const isActive = cat === categoriaSeleccionada;

                    return `
                        <button 
                            onclick="filtrarPorCategoria('${cat}')"
                            class="snap-start whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${isActive
                                ? 'bg-primary text-white'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary'
                            }"
                        >
                            ${cat}
                        </button>
                    `;
                }).join('')}

                <div class="min-w-[40px] md:hidden"></div>
            </div>
        </div>
    `;

    setTimeout(() => {
        const botonActivo = contenedor.querySelector('button.bg-primary');

        if (botonActivo) {
            botonActivo.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest'
            });
        }
    }, 50);
};

const renderizarMenu = () => {
    const contenedor = document.getElementById('menu-container');
    if (!contenedor) return;

    const productosFiltrados = categoriaSeleccionada === 'Todo'
        ? productos
        : productos.filter(p => p.categoria === categoriaSeleccionada);

    contenedor.innerHTML = productosFiltrados.map(producto => {
        const tienePersonalizacion = productoTienePersonalizacion(producto);

        return `
            <article 
                class="bg-surface-container-lowest dark:bg-slate-900/50 rounded-xl shadow-[0px_4px_12px_rgba(29,53,87,0.08)] overflow-hidden flex flex-col group border border-outline-variant/30 dark:border-slate-800 animate-in fade-in zoom-in duration-300 cursor-pointer"
                onclick="abrirDetalleProducto('${producto.id}')"
            >

                <div class="h-48 relative overflow-hidden bg-surface-variant dark:bg-slate-800">
                    <img 
                        alt="${producto.nombre}" 
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        src="${producto.imagen}" 
                    />
                </div>

                <div class="p-md flex flex-col flex-1">
                    <h3 class="font-h3 text-h3 text-on-surface dark:text-white mb-xs">
                        ${producto.nombre}
                    </h3>

                    <p class="font-body-md text-body-md text-on-surface-variant dark:text-slate-400 mb-md flex-1 line-clamp-2">
                        ${producto.descripcion}
                    </p>

                    <div class="flex justify-between items-center mt-auto relative h-10">
                        <span class="font-h2 text-h2 text-primary">
                            $${producto.precio}
                        </span>

                        <button 
                            class="absolute right-0 add-btn w-10 h-10 rounded-full bg-secondary-container dark:bg-slate-800 dark:border dark:border-slate-700 text-on-secondary-container dark:text-white flex items-center justify-center hover:brightness-105 active:scale-90 shadow-sm z-10" 
                            id="add-btn-${producto.id}" 
                            onclick="event.stopPropagation(); manejarAgregarClick('${producto.id}')"
                        >
                            <span class="material-symbols-outlined">add</span>
                        </button>

                        <div 
                            class="absolute right-0 quantity-selector flex items-center bg-surface-container-highest dark:bg-slate-800 rounded-full p-1 border border-outline-variant dark:border-slate-700 shadow-sm z-20" 
                            id="selector-${producto.id}"
                            onclick="event.stopPropagation()"
                        >
                            <button 
                                class="w-8 h-8 rounded-full text-primary flex items-center justify-center hover:bg-surface-variant dark:hover:bg-slate-700 active:scale-90 transition-all" 
                                onclick="${tienePersonalizacion ? `quitarUnaUnidadProducto('${producto.id}')` : `actualizarCantidad('${producto.id}', -1)`}"
                            >
                                <span class="material-symbols-outlined text-[20px]">remove</span>
                            </button>

                            <span 
                                class="font-label-bold text-label-bold px-2 w-6 text-center text-on-surface dark:text-white" 
                                id="qty-${producto.id}"
                            >
                                0
                            </span>

                            <button 
                                class="w-8 h-8 rounded-full text-primary flex items-center justify-center hover:bg-surface-variant dark:hover:bg-slate-700 active:scale-90 transition-all" 
                                onclick="${tienePersonalizacion ? `manejarAgregarClick('${producto.id}')` : `actualizarCantidad('${producto.id}', 1)`}"
                            >
                                <span class="material-symbols-outlined text-[20px]">add</span>
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }).join('');
};

const actualizarInformacionLocal = () => {
    const infoSection = document.getElementById('informacion');
    if (!infoSection) return;

    const pElements = infoSection.querySelectorAll('p:not(.font-label-bold)');
    const mapIframe = infoSection.querySelector('iframe');
    const footerIgLink = document.querySelector('footer a');

    if (pElements.length >= 1) pElements[0].innerText = configuracionLocal.horariosTexto;
    if (pElements.length >= 2) pElements[1].innerText = configuracionLocal.direccion.texto;
    if (mapIframe) mapIframe.setAttribute('src', configuracionLocal.direccion.mapsEmbedUrl);

    if (footerIgLink) {
        footerIgLink.href = configuracionLocal.instagram.url;
        footerIgLink.innerText = `Seguinos en Instagram ${configuracionLocal.instagram.usuario}`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    cargarCarrito();
    renderizarCategorias();
    renderizarMenu();
    actualizarInterfaz();
    actualizarInformacionLocal();

    if (sessionStorage.getItem('order_sent_toast')) {
        mostrarToast('Tu pedido fue enviado a WhatsApp');
        sessionStorage.removeItem('order_sent_toast');
    }
});

// =============================
// HERO PRINCIPAL
// =============================

document.addEventListener('DOMContentLoaded', () => {

    const hero = configuracionLocal.hero;

    if (!hero) return;

    // Imagen
    const heroImage = document.getElementById('hero-image');

    if (heroImage) {
        heroImage.src = hero.imagen;
    }

    // Etiqueta
    const heroBadge = document.getElementById('hero-badge');

    if (heroBadge) {

        if (hero.etiqueta?.habilitada) {

            heroBadge.innerText = hero.etiqueta.texto;
            heroBadge.style.display = 'inline-block';

        } else {

            heroBadge.style.display = 'none';

        }
    }

    // Título
    const heroTitle = document.getElementById('hero-title');

    if (heroTitle) {
        heroTitle.innerHTML = hero.titulo;
    }

    // Subtítulo
    const heroSubtitle = document.getElementById('hero-subtitle');

    if (heroSubtitle) {
        heroSubtitle.innerText = hero.subtitulo;
    }

    // Botón
    const heroButton = document.getElementById('hero-button');
    const heroButtonText = document.getElementById('hero-button-text');

    if (heroButton) {
        heroButton.href = hero.boton.link;
    }

    if (heroButtonText) {
        heroButtonText.innerText = hero.boton.texto;
    }

});