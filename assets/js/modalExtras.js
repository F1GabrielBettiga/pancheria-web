// Globales para el modal
let productoActualParaExtras = null;
let extrasSeleccionados = {};
let ingredientesQuitados = [];

// =============================
// MODAL DE EXTRAS / PERSONALIZACIÓN
// =============================

const abrirModalExtras = (producto, extrasPrevios = [], ingredientesQuitadosPrevios = []) => {
    productoActualParaExtras = producto;
    extrasSeleccionados = {};
    ingredientesQuitados = [...ingredientesQuitadosPrevios];

    const extrasProducto = producto.extras || [];
    const ingredientesRemovibles = producto.ingredientesRemovibles || [];

    extrasProducto.forEach(e => {
        const previo = extrasPrevios.find(p => p.id === e.id);
        extrasSeleccionados[e.id] = previo ? previo.cantidad : 0;
    });

    const seccionSinIngredientes = ingredientesRemovibles.length > 0
        ? `
            <div class="mb-8">
                <h3 class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4">
                    <span class="material-symbols-outlined text-orange-500">remove_circle</span>
                    Sin ingredientes
                </h3>

                <div class="space-y-3">
                    ${ingredientesRemovibles.map(ingrediente => `
                        <label class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 cursor-pointer transition-all">
                            <span class="font-semibold text-slate-700 dark:text-slate-300">
                                Sin ${ingrediente}
                            </span>

                            <input 
                                type="checkbox"
                                class="w-5 h-5 accent-red-600"
                                onchange="toggleIngrediente('${ingrediente}', this.checked)"
                                ${ingredientesQuitados.includes(ingrediente) ? 'checked' : ''}
                            >
                        </label>
                    `).join('')}
                </div>
            </div>
        `
        : '';

    const seccionExtras = extrasProducto.length > 0
        ? `
            <div class="space-y-4">
                <h3 class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary">add_circle</span>
                    Extras
                </h3>

                <div class="space-y-3">
                    ${extrasProducto.map(extra => `
                        <div class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                            <div class="flex flex-col">
                                <span class="font-bold text-slate-700 dark:text-slate-300">${extra.nombre}</span>
                                ${extra.precio > 0 ? `<span class="text-primary font-bold text-sm">+ $${extra.precio}</span>` : ''}
                            </div>

                            <div class="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1">
                                <button id="extra-remove-${extra.id}" onclick="modificarExtra('${extra.id}', -1)" class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                                    <span class="material-symbols-outlined text-[20px]">remove</span>
                                </button>

                                <span id="extra-qty-${extra.id}" class="w-6 text-center font-bold text-slate-700 dark:text-white">${extrasSeleccionados[extra.id]}</span>

                                <button id="extra-add-${extra.id}" onclick="modificarExtra('${extra.id}', 1)" class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                                    <span class="material-symbols-outlined text-[20px]">add</span>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `
        : '';

    const modalHTML = `
        <div id="modal-extras" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8 duration-500 border border-transparent dark:border-slate-800">
                
                <div class="relative h-48 md:h-56 shrink-0">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="w-full h-full object-cover">

                    <button onclick="cerrarModalExtras()" class="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div class="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                    <div class="mb-6">
                        <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-1">${producto.nombre}</h2>
                        <p class="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">${producto.descripcion}</p>
                    </div>

                    ${seccionSinIngredientes}
                    ${seccionExtras}
                </div>

                <div class="p-6 md:p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
                    <div class="flex items-center justify-between mb-6">
                        <div class="flex flex-col">
                            <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Unitario</span>
                            <span id="modal-total" class="text-3xl font-black text-slate-900 dark:text-white">$${producto.precio}</span>
                        </div>
                    </div>

                    <div class="flex gap-3">
                        <button 
                            onclick="cerrarModalExtras()" 
                            class="flex-1 py-4 px-6 rounded-2xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                            Cancelar
                        </button>

                        <button 
                            onclick="confirmarExtras()" 
                            class="flex-[2] bg-primary hover:bg-red-700 text-white py-4 px-6 rounded-2xl font-bold active:scale-95 transition-all flex items-center justify-center gap-2">
                            Confirmar
                            <span class="material-symbols-outlined">check_circle</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
    actualizarTotalModal();
    actualizarEstadoBotonesExtras();
};

const cerrarModalExtras = () => {
    const modal = document.getElementById('modal-extras');

    if (modal) {
        modal.classList.add('fade-out');

        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';

            window.cartItemToReplace = null;
        }, 300);
    }
};

const toggleIngrediente = (ingrediente, checked) => {
    if (checked) {
        if (!ingredientesQuitados.includes(ingrediente)) {
            ingredientesQuitados.push(ingrediente);
        }
    } else {
        ingredientesQuitados = ingredientesQuitados.filter(i => i !== ingrediente);
    }
};

const modificarExtra = (extraId, cambio) => {
    const extrasProducto = productoActualParaExtras.extras || [];
    const extra = extrasProducto.find(e => e.id === extraId);

    if (!extra) return;

    const nuevaCantidad = extrasSeleccionados[extraId] + cambio;
    const totalSeleccionados = Object.values(extrasSeleccionados).reduce((sum, q) => sum + q, 0);
    const maximoGeneral = productoActualParaExtras.maximoExtrasSeleccionados ?? Infinity;

    if (cambio > 0 && totalSeleccionados >= maximoGeneral) return;

    if (nuevaCantidad >= 0 && nuevaCantidad <= extra.cantidadMaxima) {
        extrasSeleccionados[extraId] = nuevaCantidad;

        const qty = document.getElementById(`extra-qty-${extraId}`);
        if (qty) qty.innerText = nuevaCantidad;

        actualizarTotalModal();
        actualizarEstadoBotonesExtras();
    }
};

const actualizarTotalModal = () => {
    if (!productoActualParaExtras) return;

    const extrasProducto = productoActualParaExtras.extras || [];

    let total = productoActualParaExtras.precio;

    extrasProducto.forEach(extra => {
        total += extra.precio * (extrasSeleccionados[extra.id] || 0);
    });

    const totalEl = document.getElementById('modal-total');
    if (totalEl) totalEl.innerText = `$${total}`;
};

const confirmarExtras = () => {
    const extrasProducto = productoActualParaExtras.extras || [];
    const extrasParaCarrito = [];

    extrasProducto.forEach(extra => {
        if (extrasSeleccionados[extra.id] > 0) {
            extrasParaCarrito.push({
                id: extra.id,
                nombre: extra.nombre,
                precio: extra.precio,
                cantidad: extrasSeleccionados[extra.id]
            });
        }
    });


    if (productoActualParaExtras.requiereSeleccion && extrasParaCarrito.length === 0) {
        mostrarAviso({
            titulo: "Falta seleccionar una opción",
            mensaje: `Tenés que elegir al menos una opción para ${productoActualParaExtras.nombre}.`,
            tipo: "warning",
            textoBoton: "Entendido"
        });
        return;
    }

    if (window.cartItemToReplace) {
        const itemExistente = carrito.find(i => i.cartId === window.cartItemToReplace);

        if (itemExistente) {
            itemExistente.quantity -= 1;

            if (itemExistente.quantity <= 0) {
                carrito = carrito.filter(item => item.cartId !== window.cartItemToReplace);
            }
        }

        window.cartItemToReplace = null;
    }

    agregarOActualizarProducto(productoActualParaExtras, 1, extrasParaCarrito, ingredientesQuitados);
    cerrarModalExtras();

    if (document.getElementById('cart-items') && typeof renderCart === 'function') {
        renderCart();
    }

    if (typeof actualizarInterfaz === 'function') {
        actualizarInterfaz();
    }

    if (typeof mostrarToast === 'function') {
        mostrarToast('Pedido actualizado');
    }
};

const actualizarEstadoBotonesExtras = () => {
    if (!productoActualParaExtras) return;

    const extrasProducto = productoActualParaExtras.extras || [];
    const totalSeleccionados = Object.values(extrasSeleccionados).reduce((sum, q) => sum + q, 0);
    const maximoGeneral = productoActualParaExtras.maximoExtrasSeleccionados || Infinity;

    extrasProducto.forEach(extra => {
        const cantidadActual = extrasSeleccionados[extra.id] || 0;
        const botonSumar = document.getElementById(`extra-add-${extra.id}`);
        const botonRestar = document.getElementById(`extra-remove-${extra.id}`);

        if (botonSumar) {
            const disable = totalSeleccionados >= maximoGeneral || cantidadActual >= extra.cantidadMaxima;
            botonSumar.disabled = disable;
            botonSumar.classList.toggle('opacity-40', disable);
            botonSumar.classList.toggle('cursor-not-allowed', disable);
        }

        if (botonRestar) {
            const disable = cantidadActual <= 0;
            botonRestar.disabled = disable;
            botonRestar.classList.toggle('opacity-40', disable);
            botonRestar.classList.toggle('cursor-not-allowed', disable);
        }
    });
};