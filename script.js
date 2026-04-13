// =============================================================
// IP ADDRESS TRACKER — script.js
// Version: Leaflet map setup only
// =============================================================


// ===== DOM ELEMENT SELECTION =====
const form = document.getElementById("search-form");
const queryInput = document.getElementById("query");
const statusMessage = document.getElementById("status-message");

const ipValue = document.getElementById("ip-value");
const locationValue = document.getElementById("location-value");
const timezoneValue = document.getElementById("timezone-value");
const ispValue = document.getElementById("isp-value");


// ===== LEAFLET MAP SETUP =====
// L.map("map") creates a map inside the div with id="map"
// .setView([lat, lng], zoom) sets the starting center and zoom
const map = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: true,
}).setView([0, 0], 2);

// L.tileLayer adds map tile images from OpenStreetMap
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Custom marker icon
const locationIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// L.marker creates a pin — stored in variable so we can move it later
const marker = L.marker([0, 0], { icon: locationIcon }).addTo(map);