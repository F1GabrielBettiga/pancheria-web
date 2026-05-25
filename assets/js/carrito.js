let carrito = [];
let cuponAplicado = null;

const cargarCarrito = () => {
    const guardado = localStorage.getItem('pancheria_cart');
    carrito = guardado ? JSON.parse(guardado) : [];
};

const guardarCarrito = () => {
    localStorage.setItem('pancheria_cart', JSON.stringify(carrito));
};

const guardarDatosCheckout = () => {
    const datos = {
        nombre: document.getElementById('customer-name')?.value || '',
        direccion: document.getElementById('customer-address')?.value || '',
        detalles: document.getElementById('customer-details')?.value || '',
        entrega: document.querySelector('input[name="delivery"]:checked')?.value || '',
        pago: document.querySelector('input[name="payment"]:checked')?.value || '',
        shippingInfo: window.shippingInfo || null,
        cuponAplicado: cuponAplicado
    };

    sessionStorage.setItem('checkout_data', JSON.stringify(datos));
};

const restaurarDatosCheckout = () => {
    const guardado = sessionStorage.getItem('checkout_data');
    if (!guardado) return;

    const datos = JSON.parse(guardado);

    const nameInput = document.getElementById('customer-name');
    const addressInput = document.getElementById('customer-address');
    const detailsInput = document.getElementById('customer-details');

    if (nameInput) nameInput.value = datos.nombre || '';
    if (addressInput) addressInput.value = datos.direccion || '';
    if (detailsInput) detailsInput.value = datos.detalles || '';

    if (datos.entrega) {
        const deliveryRadio = document.querySelector(`input[name="delivery"][value="${datos.entrega}"]`);
        if (deliveryRadio) deliveryRadio.checked = true;
    }

    if (datos.pago) {
        const paymentRadio = document.querySelector(`input[name="payment"][value="${datos.pago}"]`);
        if (paymentRadio) paymentRadio.checked = true;
    }

    const shippingInfoGuardado = datos.shippingInfo || null;

    if (shippingInfoGuardado) {
        window.shippingInfo = shippingInfoGuardado;
    }

    if (configuracionLocal.cupones?.habilitado && datos.cuponAplicado) {
        cuponAplicado = datos.cuponAplicado;
    }

    toggleAddress();
    togglePaymentMethod();
    actualizarEstadoVisualCupon();

    setTimeout(() => {
        if (shippingInfoGuardado) {
            window.shippingInfo = shippingInfoGuardado;
        }

        updateTotals();
    }, 500);
};

const obtenerCantidad = (id) => {
    const items = carrito.filter(producto => producto.id === id);
    return items.reduce((sum, item) => sum + item.quantity, 0);
};

const generarCartId = (producto, extrasSeleccionados = [], ingredientesQuitados = []) => {
    const extrasKey = extrasSeleccionados.length > 0
        ? extrasSeleccionados.map(e => `${e.id}x${e.cantidad}`).sort().join('-')
        : 'sinextras';

    const sinKey = ingredientesQuitados.length > 0
        ? ingredientesQuitados.map(i => i.toLowerCase().replaceAll(' ', '-')).sort().join('-')
        : 'siningredientes';

    return `${producto.id}-${extrasKey}-${sinKey}`;
};

const agregarOActualizarProducto = (producto, cambio, extrasSeleccionados = [], ingredientesQuitados = []) => {
    const tieneExtras = extrasSeleccionados.length > 0;
    const tieneSinIngredientes = ingredientesQuitados.length > 0;

    if (tieneExtras || tieneSinIngredientes) {

        const cartId = generarCartId(producto, extrasSeleccionados, ingredientesQuitados);

        const itemExistente = carrito.find(item => item.cartId === cartId);

        if (itemExistente) {

            itemExistente.quantity += 1;

        } else {

            const precioExtras = extrasSeleccionados.reduce((sum, e) =>
                sum + (e.precio * e.cantidad), 0
            );

            carrito.push({
                cartId: cartId,
                id: producto.id,
                name: producto.nombre,
                price: producto.precio + precioExtras,
                basePrice: producto.precio,
                image: producto.imagen,
                quantity: 1,
                extras: extrasSeleccionados,
                sinIngredientes: ingredientesQuitados
            });
        }

    } else {

        const cartId = generarCartId(producto, [], []);

        const itemExistente = carrito.find(item =>
            item.cartId === cartId ||
            (
                item.id === producto.id &&
                (!item.extras || item.extras.length === 0) &&
                (!item.sinIngredientes || item.sinIngredientes.length === 0)
            )
        );

        if (itemExistente) {

            itemExistente.quantity += cambio;

            if (!itemExistente.cartId) {
                itemExistente.cartId = cartId;
            }

            if (!itemExistente.basePrice) {
                itemExistente.basePrice = producto.precio;
            }

            if (itemExistente.quantity <= 0) {
                carrito = carrito.filter(item => item !== itemExistente);
            }

        } else if (cambio > 0) {

            carrito.push({
                cartId: cartId,
                id: producto.id,
                name: producto.nombre,
                price: producto.precio,
                basePrice: producto.precio,
                image: producto.imagen,
                quantity: 1,
                extras: [],
                sinIngredientes: []
            });
        }
    }

    guardarCarrito();
};

const manejarModificarClick = (cartId) => {
    cargarCarrito();

    const item = carrito.find(i =>
        i.cartId === cartId ||
        (
            i.id === cartId &&
            (!i.extras || i.extras.length === 0) &&
            (!i.sinIngredientes || i.sinIngredientes.length === 0)
        )
    );

    if (!item) return;

    const productoBase = productos.find(p => p.id === item.id);

    if (!productoBase) return;

    const tienePersonalizacion =
        (productoBase.extras && productoBase.extras.length > 0) ||
        (productoBase.ingredientesRemovibles && productoBase.ingredientesRemovibles.length > 0);

    if (!tienePersonalizacion) {
        mostrarAviso({
            titulo: "Sin opciones para modificar",
            mensaje: "Este producto no tiene extras ni ingredientes configurados para editar.",
            tipo: "info",
            textoBoton: "Entendido"
        });
        return;
    }

    window.cartItemToReplace = item.cartId || item.id;

    abrirModalExtras(
        productoBase,
        item.extras || [],
        item.sinIngredientes || []
    );
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0
    }).format(price);
};

const formatearHora = (hora) => {
    if (hora === 24) return "00:00";
    return `${String(hora).padStart(2, "0")}:00`;
};

// =============================
// ENVÍO GRATIS
// =============================

const aplicaEnvioGratis = (subtotal) => {

    const config = configuracionLocal.envioGratis;

    if (!config || !config.habilitado) return false;

    return subtotal >= Number(config.montoMinimo || 0);
};

// =============================
// CUPONES
// =============================

const checkCouponAvailability = () => {

    const section = document.getElementById('coupon-section');

    if (!section) return;

    if (configuracionLocal.cupones?.habilitado) {

        section.style.display = 'block';

        actualizarEstadoVisualCupon();

    } else {

        section.style.display = 'none';
        cuponAplicado = null;

        updateTotals();
        guardarDatosCheckout();
    }
};

const aplicarCupon = () => {

    const input = document.getElementById('coupon-code');

    const codigo = input?.value.trim().toUpperCase();

    if (!configuracionLocal.cupones?.habilitado) return;

    if (!codigo) {
        mostrarMensajeCupon('Ingresá un código.', 'error');
        return;
    }

    if (cuponAplicado) {
        mostrarMensajeCupon('Ya hay un cupón aplicado.', 'error');
        return;
    }

    const cupon = configuracionLocal.cupones.lista.find(
        c => c.codigo.toUpperCase() === codigo
    );

    if (!cupon) {
        mostrarMensajeCupon('Cupón inválido.', 'error');
        return;
    }

    if (!cupon.activo) {
        mostrarMensajeCupon('Cupón inactivo.', 'error');
        return;
    }

    cuponAplicado = cupon;

    mostrarMensajeCupon('Cupón aplicado.', 'success');

    actualizarEstadoVisualCupon();

    updateTotals();

    guardarDatosCheckout();
};

const quitarCupon = () => {
    cuponAplicado = null;

    const input = document.getElementById('coupon-code');
    if (input) input.value = '';

    actualizarEstadoVisualCupon();
    mostrarMensajeCupon('', 'none');
    updateTotals();
    guardarDatosCheckout();
};

const actualizarEstadoVisualCupon = () => {
    const infoBox = document.getElementById('applied-coupon-info');
    const textLabel = document.getElementById('applied-coupon-text');
    const inputGroup = document.querySelector('#coupon-section .flex');
    const input = document.getElementById('coupon-code');

    if (cuponAplicado) {
        if (infoBox) infoBox.classList.remove('hidden');
        if (textLabel) textLabel.innerText = `Cupón ${cuponAplicado.codigo} aplicado`;
        if (inputGroup) inputGroup.classList.add('hidden');
        if (input) input.value = cuponAplicado.codigo;
    } else {
        if (infoBox) infoBox.classList.add('hidden');
        if (inputGroup) inputGroup.classList.remove('hidden');
    }
};

const mostrarMensajeCupon = (mensaje, tipo) => {
    const el = document.getElementById('coupon-message');
    if (!el) return;

    if (tipo === 'none' || !mensaje) {
        el.innerText = '';
        el.classList.add('hidden');
        return;
    }

    el.innerText = mensaje;
    el.classList.remove('hidden', 'text-success', 'text-error');
    el.classList.add(tipo === 'success' ? 'text-success' : 'text-error');
};

const calcularDescuentoCupon = (subtotal) => {
    if (!configuracionLocal.cupones?.habilitado || !cuponAplicado) return 0;

    let descuento = 0;

    if (cuponAplicado.tipo === 'porcentaje') {
        descuento = subtotal * (cuponAplicado.valor / 100);
    } else if (cuponAplicado.tipo === 'monto') {
        descuento = cuponAplicado.valor;
    }

    if (cuponAplicado.tope > 0 && descuento > cuponAplicado.tope) {
        descuento = cuponAplicado.tope;
    }

    return Math.min(descuento, subtotal);
};

// =============================
// FORMAS DE PAGO
// =============================

const checkPaymentAvailability = () => {
    if (!configuracionLocal.formasPago) return;

    const formas = configuracionLocal.formasPago;

    const labelEfectivo = document.getElementById('label-efectivo');
    const labelTransferencia = document.getElementById('label-transferencia');

    if (labelEfectivo) {
        labelEfectivo.style.display = formas.efectivo?.habilitado ? 'block' : 'none';
    }

    if (labelTransferencia) {
        labelTransferencia.style.display = formas.transferencia?.habilitado ? 'block' : 'none';
    }

    const habilitadas = Object.keys(formas).filter(key => formas[key].habilitado);

    if (habilitadas.length === 1) {
        const input = document.getElementById(`payment-${habilitadas[0]}`);

        if (input) {
            input.checked = true;
        }
    }

    togglePaymentMethod();
};

const togglePaymentMethod = () => {
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    const bankDetails = document.getElementById('bank-details');

    if (!bankDetails) {
        updateTotals();
        return;
    }

    if (!selectedPayment) {
        bankDetails.style.display = 'none';
        updateTotals();
        return;
    }

    const isTransfer = selectedPayment.value === 'transferencia';
    bankDetails.style.display = isTransfer ? 'block' : 'none';

    if (isTransfer) {
        const config = configuracionLocal.formasPago.transferencia;

        const bankName = document.getElementById('bank-name');
        const bankOwner = document.getElementById('bank-owner');
        const bankAlias = document.getElementById('bank-alias');
        const bankCbu = document.getElementById('bank-cbu');

        if (bankName) bankName.innerText = config.banco;
        if (bankOwner) bankOwner.innerText = config.titular;
        if (bankAlias) bankAlias.innerText = config.alias;
        if (bankCbu) bankCbu.innerText = config.cbu;
    }

    updateTotals();
};

const copiarAlPortapapeles = (tipo) => {
    const config = configuracionLocal.formasPago.transferencia;
    const texto = tipo === 'alias' ? config.alias : config.cbu;
    const btn = document.getElementById(`btn-copy-${tipo}`);

    if (!btn) return;

    const mostrarCopiado = () => {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<span class="material-symbols-outlined text-[16px]">check</span>';

        setTimeout(() => {
            btn.innerHTML = originalHtml;
        }, 2000);
    };

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(texto)
            .then(mostrarCopiado)
            .catch(() => copiarConFallback(texto, mostrarCopiado));
    } else {
        copiarConFallback(texto, mostrarCopiado);
    }
};

const copiarConFallback = (texto, callback) => {
    const inputTemporal = document.createElement('textarea');
    inputTemporal.value = texto;
    inputTemporal.style.position = 'fixed';
    inputTemporal.style.left = '-9999px';
    inputTemporal.style.top = '-9999px';

    document.body.appendChild(inputTemporal);
    inputTemporal.focus();
    inputTemporal.select();

    try {
        document.execCommand('copy');
        callback();
    } catch (error) {
        mostrarAviso({
            titulo: "No se pudo copiar",
            mensaje: "Mantené presionado el texto para copiarlo manualmente.",
            tipo: "warning",
            textoBoton: "Entendido"
        });
    }

    document.body.removeChild(inputTemporal);
};

// =============================
// ENTREGA
// =============================

const checkDeliveryAvailability = () => {
    const metodos = configuracionLocal.metodosEntrega;

    const labels = {
        retiroLocal: document.getElementById('label-retiro'),
        envioDomicilio: document.getElementById('label-envio'),
        enMesa: document.getElementById('label-mesa')
    };

    const inputs = {
        retiroLocal: document.getElementById('delivery-local'),
        envioDomicilio: document.getElementById('delivery-envio'),
        enMesa: document.getElementById('delivery-mesa')
    };

    if (labels.retiroLocal) labels.retiroLocal.style.display = metodos.retiroLocal ? 'block' : 'none';
    if (labels.envioDomicilio) labels.envioDomicilio.style.display = metodos.envioDomicilio ? 'block' : 'none';
    if (labels.enMesa) labels.enMesa.style.display = metodos.enMesa ? 'block' : 'none';

    const now = new Date();
    const currentHour = now.getHours();
    let isEnvioAvailable = false;

    if (configuracionLocal.envios.habilitado && metodos.envioDomicilio) {
        const start = configuracionLocal.envios.horaInicio;
        const end = configuracionLocal.envios.horaFin;

        if (start === 0 && end === 24) {
            isEnvioAvailable = true;
        } else if (start < end) {
            isEnvioAvailable = currentHour >= start && currentHour < end;
        } else if (start > end) {
            isEnvioAvailable = currentHour >= start || currentHour < end;
        }
    }

    const messageEl = document.getElementById('delivery-message');

    if (labels.envioDomicilio && inputs.envioDomicilio) {
        if (!isEnvioAvailable && metodos.envioDomicilio) {
            labels.envioDomicilio.classList.add('opacity-50', 'pointer-events-none');
            inputs.envioDomicilio.disabled = true;

            if (messageEl) {
                messageEl.innerText = configuracionLocal.envios.habilitado
                    ? `El envío a domicilio está disponible de ${formatearHora(configuracionLocal.envios.horaInicio)} a ${formatearHora(configuracionLocal.envios.horaFin)} hs.`
                    : "El envío a domicilio no está disponible por el momento.";
            }
        } else {
            labels.envioDomicilio.classList.remove('opacity-50', 'pointer-events-none');
            inputs.envioDomicilio.disabled = false;
        }
    }

    const opcionesHabilitadas = Object.keys(metodos).filter(key => {
        if (!metodos[key]) return false;
        if (key === 'envioDomicilio' && !isEnvioAvailable) return false;
        return true;
    });

    if (opcionesHabilitadas.length === 1) {
        const mapKeys = {
            retiroLocal: 'local',
            envioDomicilio: 'envio',
            enMesa: 'mesa'
        };

        const input = document.querySelector(`input[name="delivery"][value="${mapKeys[opcionesHabilitadas[0]]}"]`);
        if (input) input.checked = true;
    } else if (opcionesHabilitadas.length > 0) {
        const actual = document.querySelector('input[name="delivery"]:checked');

        if (
            !actual ||
            actual.disabled ||
            (actual.value === 'envio' && !isEnvioAvailable) ||
            (actual.value === 'local' && !metodos.retiroLocal) ||
            (actual.value === 'mesa' && !metodos.enMesa)
        ) {
            const mapKeys = {
                retiroLocal: 'local',
                envioDomicilio: 'envio',
                enMesa: 'mesa'
            };

            const input = document.querySelector(`input[name="delivery"][value="${mapKeys[opcionesHabilitadas[0]]}"]`);
            if (input) input.checked = true;
        }
    }

    toggleAddress();

    if (!isEnvioAvailable && metodos.envioDomicilio && messageEl) {
        messageEl.innerText = configuracionLocal.envios.habilitado
            ? `El envío a domicilio está disponible de ${formatearHora(configuracionLocal.envios.horaInicio)} a ${formatearHora(configuracionLocal.envios.horaFin)} hs.`
            : "El envío a domicilio no está disponible por el momento.";
    }
};

const toggleAddress = () => {
    const selectedDelivery = document.querySelector('input[name="delivery"]:checked');
    if (!selectedDelivery) return;

    const deliveryValue = selectedDelivery.value;
    const isEnvio = deliveryValue === 'envio';

    const addressFields = document.getElementById('address-fields');
    const customerAddress = document.getElementById('customer-address');
    const shippingContainer = document.getElementById('summary-shipping-container');
    const totalLabel = document.getElementById('summary-total-label');
    const checkoutBtn = document.getElementById('btn-checkout');
    const deliveryMessage = document.getElementById('delivery-message');

    if (addressFields) addressFields.style.display = isEnvio ? 'block' : 'none';
    if (customerAddress) customerAddress.required = isEnvio;
    if (shippingContainer) shippingContainer.style.display = isEnvio ? 'flex' : 'none';

    if (isEnvio) {
        if (totalLabel) totalLabel.innerText = 'Total con envío';

        if (deliveryMessage) {
            deliveryMessage.innerText = `Los envíos están disponibles de ${formatearHora(configuracionLocal.envios.horaInicio)} a ${formatearHora(configuracionLocal.envios.horaFin)} hs.`;
        }

        if (typeof initMap === 'function') {
            setTimeout(() => {
                initMap();

                if (typeof map !== 'undefined' && map) {
                    map.invalidateSize();
                }
            }, 150);
        }

        if (window.shippingInfo && !window.shippingInfo.isValid) {
            if (checkoutBtn) checkoutBtn.disabled = true;
        }
    } else if (deliveryValue === 'mesa') {
        if (totalLabel) totalLabel.innerText = 'Total';

        if (deliveryMessage) {
            deliveryMessage.innerText = 'Enviá tu pedido y cuando esté listo te llamamos por tu nombre.';
        }

        if (checkoutBtn) checkoutBtn.disabled = false;
    } else {
        if (totalLabel) totalLabel.innerText = 'Total';

        if (deliveryMessage) {
            deliveryMessage.innerText = 'Retirá tu pedido directamente en el local.';
        }

        if (checkoutBtn) checkoutBtn.disabled = false;
    }

    updateTotals();
};

// =============================
// TOTALES
// =============================

const updateTotals = () => {
    cargarCarrito();

    const subtotal = carrito.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotal = document.getElementById('summary-total');
    const summaryShippingCost = document.getElementById('summary-shipping-cost');

    const summaryCouponContainer = document.getElementById('summary-coupon-container');
    const summaryCouponLabel = document.getElementById('summary-coupon-label');
    const summaryCouponValue = document.getElementById('summary-coupon-value');

    const summaryAdjustmentContainer = document.getElementById('summary-adjustment-container');
    const summaryAdjustmentLabel = document.getElementById('summary-adjustment-label');
    const summaryAdjustmentValue = document.getElementById('summary-adjustment-value');

    const isEnvio = document.querySelector('input[name="delivery"]:checked')?.value === 'envio';
    const selectedPayment = document.querySelector('input[name="payment"]:checked')?.value;

    const descuentoCupon = calcularDescuentoCupon(subtotal);

    let total = subtotal - descuentoCupon;
    let ajuste = 0;

    if (summarySubtotal) summarySubtotal.innerText = formatPrice(subtotal);

    if (summaryCouponContainer) {
        if (descuentoCupon > 0 && cuponAplicado) {
            summaryCouponContainer.style.display = 'flex';
            if (summaryCouponLabel) summaryCouponLabel.innerText = `Cupón ${cuponAplicado.codigo}`;
            if (summaryCouponValue) summaryCouponValue.innerText = `-${formatPrice(descuentoCupon)}`;
        } else {
            summaryCouponContainer.style.display = 'none';
        }
    }

    if (selectedPayment && configuracionLocal.formasPago && configuracionLocal.formasPago[selectedPayment]) {
        const configPago = configuracionLocal.formasPago[selectedPayment];

        if (configPago.ajustePorcentaje !== 0) {
            ajuste = total * (configPago.ajustePorcentaje / 100);
            total += ajuste;

            if (summaryAdjustmentContainer && summaryAdjustmentLabel && summaryAdjustmentValue) {
                const tipo = configPago.ajustePorcentaje > 0 ? 'Recargo' : 'Descuento';
                const metodoLabel = selectedPayment === 'efectivo' ? 'efectivo' : 'transferencia';

                summaryAdjustmentContainer.style.display = 'flex';
                summaryAdjustmentLabel.innerText = `${tipo} por pago en ${metodoLabel}`;
                summaryAdjustmentValue.innerText = formatPrice(ajuste);
            }
        } else if (summaryAdjustmentContainer) {
            summaryAdjustmentContainer.style.display = 'none';
        }
    } else if (summaryAdjustmentContainer) {
        summaryAdjustmentContainer.style.display = 'none';
    }

    if (isEnvio && window.shippingInfo) {
        if (window.shippingInfo.isValid) {
            const envioGratis = aplicaEnvioGratis(subtotal);
            const costoEnvioFinal = envioGratis ? 0 : window.shippingInfo.cost;

            total += costoEnvioFinal;

            if (summaryShippingCost) {
                if (envioGratis) {
                    summaryShippingCost.innerText = "Envío gratis";
                    summaryShippingCost.className = "font-bold text-success";
                } else {
                    summaryShippingCost.innerText = formatPrice(window.shippingInfo.cost);
                    summaryShippingCost.className = "font-bold text-on-surface";
                }
            }
        } else {
            if (summaryShippingCost) {
                summaryShippingCost.innerText = "Pendiente";
                summaryShippingCost.className = "text-sm italic";
            }
        }
    }

    if (summaryTotal) summaryTotal.innerText = formatPrice(total);
};

// =============================
// RENDER CARRITO
// =============================

const renderCart = () => {
    cargarCarrito();

    const cartContent = document.getElementById('cart-content');
    const emptyCart = document.getElementById('empty-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const checkoutHeader = document.getElementById('checkout-header');

    if (!cartContent || !emptyCart || !cartItemsContainer) return;

    if (carrito.length === 0) {
        if (checkoutHeader) checkoutHeader.style.display = 'none';

        cartContent.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }

    if (checkoutHeader) checkoutHeader.style.display = 'block';

    cartContent.style.display = 'block';
    emptyCart.style.display = 'none';

    cartItemsContainer.innerHTML = carrito.map(item => {
        const idParaFunciones = item.cartId || item.id;
        const tieneExtras = item.extras && item.extras.length > 0;
        const tieneSinIngredientes = item.sinIngredientes && item.sinIngredientes.length > 0;

        const sinIngredientesHTML = tieneSinIngredientes
            ? `<div class="mt-2 space-y-1">
                <p class="text-xs font-bold text-orange-500">Sin:</p>
                ${item.sinIngredientes.map(i => `
                    <p class="text-xs text-on-surface-variant dark:text-slate-400 flex items-center gap-1">
                        <span class="material-symbols-outlined text-[14px]">remove</span>
                        ${i}
                    </p>
                `).join('')}
            </div>`
            : '';

        const extrasHTML = tieneExtras
            ? `<div class="mt-2 space-y-1">
                <p class="text-xs font-bold text-primary">Extras:</p>
                ${item.extras.map(e => `
                    <p class="text-xs text-on-surface-variant dark:text-slate-400 flex items-center gap-1">
                        <span class="material-symbols-outlined text-[14px]">add</span>
                        ${e.cantidad}x ${e.nombre}
                    </p>
                `).join('')}
            </div>`
            : '';

        const productoBase = productos.find(p => p.id === item.id);

        const tienePersonalizacion =
            productoBase &&
            (
                (productoBase.extras && productoBase.extras.length > 0) ||
                (productoBase.ingredientesRemovibles && productoBase.ingredientesRemovibles.length > 0)
            );

        const botonModificar = tienePersonalizacion
            ? `<button onclick="manejarModificarClick('${idParaFunciones}')" class="mt-2 text-xs font-bold text-primary flex items-center gap-1 hover:underline">
            <span class="material-symbols-outlined text-[16px]">edit</span>
            Modificar
        </button>`
            : '';

        return `
            <div class="bg-surface-container-lowest dark:bg-slate-900/50 rounded-3xl shadow-sm p-md flex items-center justify-between border border-surface-variant dark:border-slate-800 transition-all">
                <div class="flex items-center gap-md flex-1">
                    ${item.image ? `<img alt="${item.name}" class="w-20 h-20 object-cover rounded-2xl" src="${item.image}"/>` : ''}

                    <div>
                        <h3 class="font-h3 text-h3 text-on-surface dark:text-white">${item.name}</h3>
                        ${sinIngredientesHTML}
                        ${extrasHTML}
                        ${botonModificar}
                        <p class="font-body-md text-body-md text-brand-red font-bold mt-xs">${formatPrice(item.price * item.quantity)}</p>
                    </div>
                </div>

                <div class="flex flex-col items-end gap-sm">
                    <button class="text-on-surface-variant dark:text-slate-500 hover:text-error transition-colors p-1" onclick="removeItem('${idParaFunciones}')">
                        <span class="material-symbols-outlined text-[20px]">close</span>
                    </button>

                    <div class="flex items-center bg-surface dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-full px-xs py-xs">
                        <button class="w-8 h-8 flex items-center justify-center text-on-surface-variant dark:text-slate-400 rounded-full hover:bg-surface-variant dark:hover:bg-slate-700 transition-colors" onclick="updateQuantity('${idParaFunciones}', -1)">
                            <span class="material-symbols-outlined text-[20px]">remove</span>
                        </button>

                        <span class="font-label-bold text-label-bold text-on-surface dark:text-white w-6 text-center">${item.quantity}</span>

                        <button class="w-8 h-8 flex items-center justify-center text-on-surface-variant dark:text-slate-400 rounded-full hover:bg-surface-variant dark:hover:bg-slate-700 transition-colors" onclick="updateQuantity('${idParaFunciones}', 1)">
                            <span class="material-symbols-outlined text-[20px]">add</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    updateTotals();
};

const updateQuantity = (cartId, delta) => {
    cargarCarrito();

    const itemIndex = carrito.findIndex(item =>
        (item.cartId === cartId) ||
        (item.id === cartId && (!item.extras || item.extras.length === 0) && (!item.sinIngredientes || item.sinIngredientes.length === 0))
    );

    if (itemIndex > -1) {
        carrito[itemIndex].quantity += delta;

        if (carrito[itemIndex].quantity <= 0) {
            carrito.splice(itemIndex, 1);
        }

        guardarCarrito();
        renderCart();
    }
};

const removeItem = (cartId) => {
    cargarCarrito();

    carrito = carrito.filter(item =>
        (item.cartId !== cartId) &&
        !(item.id === cartId && (!item.extras || item.extras.length === 0) && (!item.sinIngredientes || item.sinIngredientes.length === 0))
    );

    guardarCarrito();
    renderCart();
};

// =============================
// CHECKOUT
// =============================

const checkout = () => {
    cargarCarrito();

    // Validación extra antes de enviar el pedido por WhatsApp
    // Evita que productos con requiereSeleccion: true salgan sin opción seleccionada
    const itemSinSeleccionObligatoria = carrito.find(item => {
        const productoBase = productos.find(p => p.id === item.id);

        return productoBase?.requiereSeleccion &&
            (!item.extras || item.extras.length === 0);
    });

    if (itemSinSeleccionObligatoria) {
        mostrarAviso({
            titulo: "Falta seleccionar una opción",
            mensaje: `El producto "${itemSinSeleccionObligatoria.name}" requiere que selecciones una opción antes de enviar el pedido.`,
            tipo: "warning",
            textoBoton: "Entendido"
        });
        return;
    }

    if (typeof estaLocalAbierto === 'function' && !estaLocalAbierto()) {
        mostrarAviso({
            titulo: "Local cerrado",
            mensaje: "El local está cerrado. Vas a poder enviar el pedido cuando abramos.",
            tipo: "info",
            textoBoton: "Entendido"
        });
        return;
    }

    const nameEl = document.getElementById('customer-name');
    const name = nameEl ? nameEl.value.trim() : '';

    const deliveryInput = document.querySelector('input[name="delivery"]:checked');
    const deliveryType = deliveryInput ? deliveryInput.value : '';

    const paymentInput = document.querySelector('input[name="payment"]:checked');
    const paymentType = paymentInput ? paymentInput.value : '';

    const addressEl = document.getElementById('customer-address');
    const address = addressEl ? addressEl.value.trim() : '';

    const detailsEl = document.getElementById('customer-details');
    const details = detailsEl ? detailsEl.value.trim() : '';

    if (!name) {
        mostrarAviso({
            titulo: "Falta tu nombre",
            mensaje: "Por favor, ingresá tu nombre para poder enviar el pedido.",
            tipo: "warning",
            textoBoton: "Entendido"
        });
        return;
    }

    if (!deliveryType) {
        mostrarAviso({
            titulo: "Falta método de entrega",
            mensaje: "Por favor, seleccioná si querés retirar, envío a domicilio o pedir en mesa.",
            tipo: "warning",
            textoBoton: "Entendido"
        });
        return;
    }

    if (!paymentType) {
        mostrarAviso({
            titulo: "Falta forma de pago",
            mensaje: "Por favor, seleccioná una forma de pago para continuar.",
            tipo: "warning",
            textoBoton: "Entendido"
        });
        return;
    }

    if (deliveryType === 'envio') {
        if (!address) {
            mostrarAviso({
                titulo: "Falta la dirección",
                mensaje: "Por favor, ingresá tu dirección de envío para calcular el costo.",
                tipo: "warning",
                textoBoton: "Entendido"
            });
            return;
        }

        if (!window.shippingInfo || !window.shippingInfo.isValid) {
            mostrarAviso({
                titulo: "No se pudo calcular el envío",
                mensaje: "Revisá la dirección ingresada o verificá que esté dentro de la zona de entrega.",
                tipo: "warning",
                textoBoton: "Entendido"
            });
            return;
        }
    }

    const subtotal = carrito.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const descuentoCupon = calcularDescuentoCupon(subtotal);
    const subtotalConDescuento = subtotal - descuentoCupon;

    const envioGratis = deliveryType === 'envio' && aplicaEnvioGratis(subtotal);

    const shippingCost = deliveryType === 'envio'
        ? (envioGratis ? 0 : window.shippingInfo.cost)
        : 0;

    let ajuste = 0;

    if (configuracionLocal.formasPago && configuracionLocal.formasPago[paymentType]) {
        const configPago = configuracionLocal.formasPago[paymentType];
        ajuste = subtotalConDescuento * (configPago.ajustePorcentaje / 100);
    }

    const total = subtotalConDescuento + shippingCost + ajuste;

    const deliveryLabels = {
        local: "Retiro en Local",
        envio: "Envío a Domicilio",
        mesa: "En mesa"
    };

    const paymentLabels = {
        efectivo: "Efectivo",
        transferencia: "Transferencia"
    };

    let message = `*Nuevo Pedido*\n\n`;
    message += `*Nombre:* ${name}\n`;
    message += `*Entrega:* ${deliveryLabels[deliveryType]}\n`;
    message += `*Forma de pago:* ${paymentLabels[paymentType]}\n`;

    if (deliveryType === 'envio') {
        message += `*Dirección:* ${address}\n`;

        if (details) {
            message += `*Detalles:* ${details}\n`;
        }

        message += `*Distancia estimada:* ${window.shippingInfo.distanceKm.toFixed(2)} km\n`;
    }

    message += `\n*Detalle del pedido:*\n`;

    carrito.forEach(item => {
        message += `• ${item.quantity}x ${item.name} (${formatPrice(item.price * item.quantity)})\n`;

        if (item.sinIngredientes && item.sinIngredientes.length > 0) {
            message += `           Sin:\n`;

            item.sinIngredientes.forEach(i => {
                message += `               - ${i}\n`;
            });
        }

        if (item.extras && item.extras.length > 0) {
            message += `           Extras:\n`;

            item.extras.forEach(e => {
                message += `               + ${e.cantidad}x ${e.nombre}\n`;
            });
        }
    });

    message += `\n*Subtotal:* ${formatPrice(subtotal)}\n`;

    if (descuentoCupon > 0 && cuponAplicado) {
        message += `*Cupón aplicado:* ${cuponAplicado.codigo}\n`;
        message += `*Descuento por cupón:* -${formatPrice(descuentoCupon)}\n`;
    }

    if (ajuste !== 0) {
        const tipoLabel = ajuste > 0 ? 'Recargo' : 'Descuento';
        message += `*${tipoLabel} por ${paymentLabels[paymentType]}:* ${formatPrice(ajuste)}\n`;
    }

    if (deliveryType === 'envio') {
        message += envioGratis
            ? `*Costo de Envío:* Envío gratis\n`
            : `*Costo de Envío:* ${formatPrice(shippingCost)}\n`;
    }

    message += `*Total:* ${formatPrice(total)}\n`;

    if (paymentType === 'transferencia') {
        const p = configuracionLocal.formasPago.transferencia;

        message += `\n*Datos para la transferencia:*\n`;
        message += `Banco: ${p.banco}\n`;
        message += `Titular: ${p.titular}\n`;
        message += `Alias: ${p.alias}\n`;
        message += `CBU/CVU: ${p.cbu}\n`;
        message += `\n*Comprobante:* enviar por WhatsApp una vez realizada la transferencia.\n`;
    }

    const phoneNumber = configuracionLocal.whatsapp;

    localStorage.removeItem('pancheria_cart');
    sessionStorage.removeItem('checkout_data');

    carrito = [];
    cuponAplicado = null;
    sessionStorage.setItem('order_sent_toast', 'true');

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    window.location.href = 'index.html';
};

const cancelOrder = () => {
    mostrarConfirmacion({
        titulo: "Cancelar pedido",
        mensaje: "¿Estás seguro de que querés cancelar el pedido? Se va a borrar todo el carrito.",
        tipo: "error",
        textoCancelar: "Volver",
        textoConfirmar: "Sí, cancelar",
        onConfirmar: () => {
            localStorage.removeItem('pancheria_cart');
            sessionStorage.removeItem('checkout_data');
            window.location.href = 'index.html';
        }
    });
};

// =============================
// INICIALIZACIÓN
// =============================

document.addEventListener('DOMContentLoaded', () => {
    const instagramLink = document.getElementById('instagram-link');

    if (instagramLink) {
        instagramLink.innerText = configuracionLocal.instagram.usuario;
        instagramLink.href = configuracionLocal.instagram.url;
    }

    if (document.getElementById('cart-items')) {
        restaurarDatosCheckout();

        checkDeliveryAvailability();
        checkPaymentAvailability();
        checkCouponAvailability();
        renderCart();

        document.getElementById('customer-name')?.addEventListener('input', guardarDatosCheckout);
        document.getElementById('customer-address')?.addEventListener('input', guardarDatosCheckout);
        document.getElementById('customer-details')?.addEventListener('input', guardarDatosCheckout);

        document.querySelectorAll('input[name="delivery"]').forEach(input => {
            input.addEventListener('change', () => {
                toggleAddress();
                guardarDatosCheckout();
            });
        });

        document.querySelectorAll('input[name="payment"]').forEach(input => {
            input.addEventListener('change', () => {
                togglePaymentMethod();
                guardarDatosCheckout();
            });
        });

        const btnApplyCoupon = document.getElementById('btn-apply-coupon');
        if (btnApplyCoupon) btnApplyCoupon.addEventListener('click', aplicarCupon);

        const btnRemoveCoupon = document.getElementById('btn-remove-coupon');
        if (btnRemoveCoupon) btnRemoveCoupon.addEventListener('click', quitarCupon);

        const couponInput = document.getElementById('coupon-code');
        if (couponInput) {
            couponInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    aplicarCupon();
                }
            });
        }

        const btnCheckout = document.getElementById('btn-checkout');
        if (btnCheckout) btnCheckout.addEventListener('click', checkout);

        const btnCancel = document.getElementById('btn-cancel');
        if (btnCancel) btnCancel.addEventListener('click', cancelOrder);

        const btnCopyAlias = document.getElementById('btn-copy-alias');
        if (btnCopyAlias) btnCopyAlias.addEventListener('click', () => copiarAlPortapapeles('alias'));

        const btnCopyCbu = document.getElementById('btn-copy-cbu');
        if (btnCopyCbu) btnCopyCbu.addEventListener('click', () => copiarAlPortapapeles('cbu'));

        window.addEventListener('beforeunload', guardarDatosCheckout);
    }
});