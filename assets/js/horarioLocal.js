const estaLocalAbierto = () => {
    if (!configuracionLocal.horarioLocal.habilitado) return true;

    const ahora = new Date();
    const horaActual = ahora.getHours();
    const { horaApertura, horaCierre } = configuracionLocal.horarioLocal;

    // Caso 24 horas
    if (horaApertura === 0 && horaCierre === 24) return true;

    // Horario normal (ej: 8 a 20)
    if (horaApertura < horaCierre) {
        return horaActual >= horaApertura && horaActual < horaCierre;
    }

    // Horario que pasa medianoche (ej: 20 a 2)
    if (horaApertura > horaCierre) {
        return horaActual >= horaApertura || horaActual < horaCierre;
    }

    return false;
};

const formatearHoraLocal = (hora) => {
    if (hora === 24 || hora === 0) return "00:00";
    return `${String(hora).padStart(2, "0")}:00`;
};

const cerrarModalHorario = () => {
    const modal = document.getElementById('modal-horario-local');
    if (modal) {
        modal.classList.add('opacity-0');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
};

const chequearEstadoLocal = () => {
    const abierto = estaLocalAbierto();
    const mensaje = `Abrimos de ${formatearHoraLocal(configuracionLocal.horarioLocal.horaApertura)} a ${formatearHoraLocal(configuracionLocal.horarioLocal.horaCierre)} hs.`;
    
    const esIndex = !!document.getElementById('menu');
    const esCarrito = !!document.getElementById('cart-items');

    if (!abierto) {
        // En Index: Mostrar Modal/Overlay inicial
        if (esIndex) {
            const htmlModal = `
                <div id="modal-horario-local" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md transition-opacity duration-300">
                    <div class="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom-8 duration-500 text-center">
                        <div class="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mx-auto mb-6">
                            <span class="material-symbols-outlined text-[40px]">schedule</span>
                        </div>
                        <h2 class="text-2xl font-black text-slate-900 mb-2">El local se encuentra cerrado</h2>
                        <p class="text-lg font-bold text-amber-600 mb-4">${mensaje}</p>
                        <p class="text-slate-500 mb-8 leading-relaxed">
                            Podés ver el menú y armar tu carrito, pero vas a poder enviar el pedido cuando abramos.
                        </p>
                        <button onclick="cerrarModalHorario()" class="w-full bg-slate-900 text-white py-4 px-6 rounded-2xl font-bold hover:bg-slate-800 active:scale-95 transition-all">
                            Ver menú igualmente
                        </button>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('afterbegin', htmlModal);
            document.body.style.overflow = 'hidden';
        }

        // En Carrito: Deshabilitar botón y mostrar mensaje
        if (esCarrito) {
            const btnWhatsApp = document.querySelector('button[onclick="checkout()"]');
            if (btnWhatsApp) {
                btnWhatsApp.disabled = true;
                btnWhatsApp.classList.add('opacity-50', 'grayscale', 'cursor-not-allowed');
                
                if (!document.getElementById('mensaje-cerrado-carrito')) {
                    const infoMsg = `<div id="mensaje-cerrado-carrito" class="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center">
                        <p class="text-sm font-bold text-amber-900 mb-1">El local está cerrado actualmente</p>
                        <p class="text-xs text-amber-700/80">
                            Podés revisar tu pedido, pero vas a poder enviarlo cuando abramos de ${formatearHoraLocal(configuracionLocal.horarioLocal.horaApertura)} a ${formatearHoraLocal(configuracionLocal.horarioLocal.horaCierre)} hs.
                        </p>
                    </div>`;
                    btnWhatsApp.parentNode.insertAdjacentHTML('beforeend', infoMsg);
                }
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', chequearEstadoLocal);