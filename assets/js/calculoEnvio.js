/**
 * Lógica para cálculo de envío por distancia usando Leaflet, OSM y Geoapify.
 */

let map;
let marker;
let shippingInfo = {
    distanceKm: 0,
    cost: 0,
    isValid: false,
    coords: null,
    address: "",
    lat: null,
    lng: null
};

const initMap = () => {
    const config = configuracionLocal.envios.calculoPorDistancia;
    if (!config || !config.habilitado) return;

    const origin = [config.latOrigen, config.lngOrigen];

    // Evitar reinicializar si ya existe
    if (map) return;

    map = L.map('map').setView(origin, config.zoomInicial);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    // Marcador del local (fijo)
    const localIcon = L.icon({
        iconUrl: 'assets/img/logo.png',

        iconSize: [42, 42],
        iconAnchor: [21, 42],
        popupAnchor: [0, -40]
    });

    const localMarker = L.marker(origin, {
        icon: localIcon
    }).addTo(map);

    localMarker.bindPopup(`
    <div style="font-weight:700;">
        ${configuracionLocal.nombre}
    </div>
`);


    // Marcador de destino
    const destinoIcon = L.divIcon({
        className: '',
        html: `
        <div style="
            font-size: 30px;
            line-height: 1;
            filter: drop-shadow(0 3px 4px rgba(0,0,0,0.35));
        ">
            🏠
        </div>
    `,
        iconSize: [34, 34],
        iconAnchor: [17, 34]
    });

    marker = L.marker(origin, {
        draggable: false,
        icon: destinoIcon
    }).addTo(map);

    restaurarUbicacionGuardada();
    // Evento click en el mapa para selección manual
    map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        actualizarUbicacionManual(lat, lng);
    });
};

const restaurarUbicacionGuardada = () => {
    if (!window.shippingInfo) return;
    if (!window.shippingInfo.lat || !window.shippingInfo.lng) return;
    if (!marker || !map) return;

    const lat = window.shippingInfo.lat;
    const lng = window.shippingInfo.lng;

    marker.setLatLng([lat, lng]);
    map.setView([lat, lng], 15);

    updateTotals();
};


const actualizarUbicacionManual = (lat, lng) => {
    marker.setLatLng([lat, lng]);
    document.getElementById('map-status').innerText = "Ubicación seleccionada manualmente";
    shippingInfo.coords = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    shippingInfo.lat = lat;
    shippingInfo.lng = lng;

    calcularCostoYDistancia(lat, lng);

    if (typeof guardarDatosCheckout === 'function') {
        guardarDatosCheckout();
    }
};

const buscarDireccion = async (direccion) => {
    if (!direccion) return;

    const config = configuracionLocal.envios.calculoPorDistancia;
    const mapStatus = document.getElementById('map-status');
    mapStatus.innerText = "Buscando dirección...";

    const apiKey = config.geoapifyApiKey;
    const country = config.paisBusqueda;
    const limit = config.limiteResultados;

    const direccionConZona = `${direccion}, ${config.zonaBusqueda}`;

    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(direccionConZona)}&filter=countrycode:${country === 'Argentina' ? 'ar' : 'ar'}&limit=${limit}&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
            const feature = data.features[0];
            const [lon, lat] = feature.geometry.coordinates;
            const displayName = feature.properties.formatted;

            marker.setLatLng([lat, lon]);
            map.setView([lat, lon], 15);
            mapStatus.innerText = "Dirección encontrada";
            shippingInfo.address = displayName;
            shippingInfo.coords = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
            shippingInfo.lat = lat;
            shippingInfo.lng = lon;

            calcularCostoYDistancia(lat, lon);

            if (typeof guardarDatosCheckout === 'function') {
                guardarDatosCheckout();
            }
        } else {
            manejarDireccionNoEncontrada();
        }
    } catch (error) {
        console.error("Error buscando dirección con Geoapify:", error);
        manejarDireccionNoEncontrada();
    }
};

const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const calcularCostoYDistancia = (latDestino, lngDestino) => {
    const config = configuracionLocal.envios.calculoPorDistancia;
    const distancia = calcularDistancia(config.latOrigen, config.lngOrigen, latDestino, lngDestino);

    shippingInfo.distanceKm = distancia;
    const statusEl = document.getElementById('shipping-status-message');
    const checkoutBtn = document.getElementById('btn-checkout');

    if (distancia > config.kmMaximos) {
        shippingInfo.isValid = false;
        shippingInfo.cost = 0;
        statusEl.innerText = config.mensajeFueraDeZona;
        statusEl.className = "p-md rounded-xl font-label-bold text-label-bold bg-error/10 text-error block";
        if (checkoutBtn) checkoutBtn.disabled = true;
    } else {

        const kmExtra = Math.max(0, distancia - 1);
        const costo = config.precioBase + (kmExtra * config.precioPorKm);

        shippingInfo.cost = Math.round(costo);

        shippingInfo.isValid = true;

        statusEl.innerText =
            `Distancia estimada: ${distancia.toFixed(1)} km. Costo de envío: ${formatPrice(shippingInfo.cost)}`;

        statusEl.className =
            "p-md rounded-xl font-label-bold text-label-bold bg-success/10 text-success block";

        if (checkoutBtn) checkoutBtn.disabled = false;
    }

    // Exponer el envío actualizado para carrito.js
    window.shippingInfo = shippingInfo;

    // Actualizar resumen en el carrito
    updateTotals();

    // Guardar datos del checkout apenas se calcula el envío
    if (typeof guardarDatosCheckout === 'function') {
        guardarDatosCheckout();
    }
};

const manejarDireccionNoEncontrada = () => {
    const config = configuracionLocal.envios.calculoPorDistancia;
    const statusEl = document.getElementById('shipping-status-message');
    const checkoutBtn = document.getElementById('btn-checkout');
    const mapStatus = document.getElementById('map-status');

    shippingInfo.isValid = false;
    shippingInfo.cost = 0;
    mapStatus.innerText = "No se encontró la dirección";
    statusEl.innerText = config.mensajeDireccionNoEncontrada;
    statusEl.className = "p-md rounded-xl font-label-bold text-label-bold bg-warning/10 text-warning block";
    if (checkoutBtn) checkoutBtn.disabled = true;

    updateTotals();
};

// Exponer shippingInfo para carrito.js
window.shippingInfo = shippingInfo;

// Listener para el input de dirección
document.addEventListener('DOMContentLoaded', () => {
    const addressInput = document.getElementById('customer-address');
    if (addressInput) {
        addressInput.addEventListener('blur', () => {
            const val = addressInput.value.trim();
            if (val) buscarDireccion(val);
        });
    }
});