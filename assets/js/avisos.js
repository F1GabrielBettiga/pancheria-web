const mostrarAviso = ({
    titulo = "Aviso",
    mensaje = "",
    tipo = "warning",
    textoBoton = "Entendido"
}) => {
    const avisoAnterior = document.getElementById("modal-aviso-personalizado");

    if (avisoAnterior) {
        avisoAnterior.remove();
    }

    const iconos = {
        warning: "warning",
        error: "error",
        success: "check_circle",
        info: "info"
    };

    const colores = {
        warning: "text-yellow-500",
        error: "text-red-500",
        success: "text-green-500",
        info: "text-blue-500"
    };

    const icono = iconos[tipo] || iconos.warning;
    const colorIcono = colores[tipo] || colores.warning;

    const modalHTML = `
        <div 
            id="modal-aviso-personalizado" 
            class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
        >
            <div class="w-full max-w-sm rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                
                <div class="p-6 text-center">
                    <div class="mx-auto mb-4 w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <span class="material-symbols-outlined text-[32px] ${colorIcono}">
                            ${icono}
                        </span>
                    </div>

                    <h3 class="text-xl font-black text-slate-900 dark:text-white mb-2">
                        ${titulo}
                    </h3>

                    <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        ${mensaje}
                    </p>
                </div>

                <div class="px-6 pb-6">
                    <button 
                        onclick="cerrarAviso()" 
                        class="w-full bg-primary hover:bg-red-700 text-white py-4 rounded-2xl font-bold active:scale-95 transition-all"
                    >
                        ${textoBoton}
                    </button>
                </div>

            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
};

const mostrarConfirmacion = ({
    titulo = "Confirmar acción",
    mensaje = "",
    tipo = "warning",
    textoCancelar = "Cancelar",
    textoConfirmar = "Confirmar",
    onConfirmar = null
}) => {
    const avisoAnterior = document.getElementById("modal-aviso-personalizado");

    if (avisoAnterior) {
        avisoAnterior.remove();
    }

    const iconos = {
        warning: "warning",
        error: "delete",
        success: "check_circle",
        info: "info"
    };

    const colores = {
        warning: "text-yellow-500",
        error: "text-red-500",
        success: "text-green-500",
        info: "text-blue-500"
    };

    const icono = iconos[tipo] || iconos.warning;
    const colorIcono = colores[tipo] || colores.warning;

    window.confirmacionAvisoCallback = onConfirmar;

    const modalHTML = `
        <div 
            id="modal-aviso-personalizado" 
            class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
        >
            <div class="w-full max-w-sm rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                
                <div class="p-6 text-center">
                    <div class="mx-auto mb-4 w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <span class="material-symbols-outlined text-[32px] ${colorIcono}">
                            ${icono}
                        </span>
                    </div>

                    <h3 class="text-xl font-black text-slate-900 dark:text-white mb-2">
                        ${titulo}
                    </h3>

                    <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        ${mensaje}
                    </p>
                </div>

                <div class="px-6 pb-6 flex gap-3">
                    <button 
                        onclick="cerrarAviso()" 
                        class="flex-1 py-4 rounded-2xl font-bold text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
                    >
                        ${textoCancelar}
                    </button>

                    <button 
                        onclick="confirmarAviso()" 
                        class="flex-1 py-4 rounded-2xl font-bold bg-primary hover:bg-red-700 text-white active:scale-95 transition-all"
                    >
                        ${textoConfirmar}
                    </button>
                </div>

            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
};

const cerrarAviso = () => {
    const modal = document.getElementById("modal-aviso-personalizado");

    if (modal) {
        modal.remove();
    }

    window.confirmacionAvisoCallback = null;
};

const confirmarAviso = () => {
    if (typeof window.confirmacionAvisoCallback === "function") {
        window.confirmacionAvisoCallback();
    }

    cerrarAviso();
};