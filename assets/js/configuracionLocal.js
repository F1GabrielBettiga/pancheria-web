const configuracionLocal = {

    // =============================
    // HERO / PORTADA PRINCIPAL
    // =============================

    hero: {

        // Imagen principal del index
        imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkKLZpRmUbZ4ucDhSSlHW0yihjZLkvbWq3dx-C913a6tCwaA4L9A4IRGr5Gvtxefuct9RD7rdKBB22uM60Klvb_AEa8RQ2Ga18vngECtGbBwooDU6U81V6H-ascezfpv_S9mtaFTcWZxpiD-SzdOfW0hA7qxlDP8fL9BhzfPFZZH010LWwhBiy6oalX0CsBh1qUsqjowe_2FMP82IKocN5-kyLzMCHapOd-N_xaukprXvSEeK7_nOzD7KJhfV2aPsn7jG5wniCC30",

        // =============================
        // ETIQUETA SUPERIOR
        // =============================

        etiqueta: {

            // Mostrar u ocultar
            habilitada: true,

            // Texto
            texto: "NUEVO MENÚ"
        },

        // =============================
        // TÍTULO PRINCIPAL
        // =============================

        titulo: "Armá tu pedido y mandalo directo por WhatsApp 🌭",

        // =============================
        // SUBTÍTULO
        // =============================

        subtitulo: "La mejor experiencia de panchos gourmet, listos para retirar o enviar.",

        // =============================
        // BOTÓN
        // =============================

        boton: {

            // Texto botón
            texto: "Ver menú",

            // Link botón
            link: "#menu"
        }
    },

    // =============================
    // INFORMACIÓN GENERAL DEL LOCAL
    // =============================

    // Nombre del local
    nombre: "Panchería",

    // Logo que aparece en la web
    logo: "assets/img/logo.png",

    // Número de WhatsApp al que llegan los pedidos
    // Formato: código país + número
    whatsapp: "5491122980645",

    // =============================
    // INSTAGRAM
    // =============================

    instagram: {

        // Texto que se muestra en la página
        usuario: "@Gabriel_Tech",

        // Link al perfil de Instagram
        url: "https://www.instagram.com/bettiga_pc_?igsh=OXV4Y2Vlc2p3MTNz"
    },

    // =============================
    // MÉTODOS DE ENTREGA
    // =============================
    // true = habilitado
    // false = oculto/deshabilitado

    metodosEntrega: {

        // Permite retiro en el local
        retiroLocal: true,

        // Permite envío a domicilio
        envioDomicilio: true,

        // Permite pedir "en mesa"
        enMesa: true
    },

    // =============================
    // FORMAS DE PAGO
    // =============================

    formasPago: {

        // =============================
        // EFECTIVO
        // =============================

        efectivo: {

            // Habilitar/deshabilitar efectivo
            habilitado: true,

            // Descuento o recargo
            // NEGATIVO = descuento
            // POSITIVO = recargo
            ajustePorcentaje: -10
        },

        // =============================
        // TRANSFERENCIA
        // =============================

        transferencia: {

            // Habilitar/deshabilitar transferencia
            habilitado: true,

            // Recargo o descuento
            ajustePorcentaje: 10,

            // Datos bancarios
            banco: "Santander",
            titular: "Nombre del propietario",
            alias: "alias.ejemplo",
            cbu: "0000000000000000000000"
        }
    },

    // =============================
    // CUPONES
    // =============================

    cupones: {

        // Activa o desactiva TODOS los cupones
        habilitado: true,

        // Lista de cupones
        lista: [

            // =============================
            // CUPÓN POR PORCENTAJE
            // =============================

            {
                // Código que escribe el cliente
                codigo: "LOKI10",

                // Tipo:
                // porcentaje = descuento %
                // monto = descuento fijo
                tipo: "porcentaje",

                // Valor del descuento
                valor: 10,

                // Tope máximo de descuento
                // 0 = sin límite
                tope: 5000,

                // Activar/desactivar este cupón
                activo: true
            },

            // =============================
            // CUPÓN POR MONTO FIJO
            // =============================

            {
                codigo: "SALCHI500",

                tipo: "monto",

                // Descuento fijo
                valor: 500,

                // 0 = sin límite
                tope: 0,

                activo: true
            }
        ]
    },

    // =============================
    // DIRECCIÓN DEL LOCAL
    // =============================

    direccion: {

        // Texto visible
        texto: "Av. Corrientes 1234, CABA",

        // Link del mapa embebido
        mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3289.6408314177384!2d-58.62715505966118!3d-34.461264165166256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bca493a4889567%3A0xdebec819e5607d07!2sOlegario%20Victor%20Andrade%20433%2C%20B1617%20Gral.%20Pacheco%2C%20Provincia%20 de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1778722309573!5m2!1ses-419!2sar"
    },

    // =============================
    // TEXTO DE HORARIOS
    // =============================

    horariosTexto: "Mar a Dom: 19:00 - 00:00 hs",

    // =============================
    // HORARIO DEL LOCAL
    // =============================

    horarioLocal: {

        // Activa/desactiva control de horario
        habilitado: true,

        // Hora apertura
        horaApertura: 13,

        // Hora cierre
        horaCierre: 24
    },

    // =============================
    // CONFIGURACIÓN DE ENVÍOS
    // =============================

    envios: {

        // Activa/desactiva envíos
        habilitado: true,

        // Horario disponible para delivery
        horaInicio: 18,
        horaFin: 24,

        // =============================
        // CÁLCULO POR DISTANCIA
        // =============================

        calculoPorDistancia: {

            // Activar cálculo automático
            habilitado: true,

            // Precio mínimo del envío
            precioBase: 1500,

            // Precio extra por kilómetro
            precioPorKm: 700,

            // Distancia máxima permitida
            kmMaximos: 10,

            // Coordenadas del local
            latOrigen: -34.46781218193366,
            lngOrigen: -58.64931701396046,

            // Zoom inicial del mapa
            zoomInicial: 14,

            // Mensaje fuera de zona
            mensajeFueraDeZona: "No hacemos envíos en esa zona.",

            // Error si no encuentra dirección
            mensajeDireccionNoEncontrada: "No pudimos encontrar esa dirección. Revisá que esté bien escrita.",

            // API de Geoapify
            geoapifyApiKey: "6ea0fa17ac87477ba92bdbb63ae58fb4",

            // País de búsqueda
            paisBusqueda: "Argentina",

            // Zona principal de búsqueda
            zonaBusqueda: "Buenos Aires, Argentina",

            // Cantidad máxima de resultados
            limiteResultados: 1
        }
    },

    // =============================
    // ENVÍO GRATIS
    // =============================

    envioGratis: {

        // Activa/desactiva envío gratis
        habilitado: true,

        // Monto mínimo para obtener envío gratis
        montoMinimo: 100000
    }

};