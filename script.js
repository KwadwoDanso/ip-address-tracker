// 
// IP ADDRESS TRACKER — script.js
//


//  SECTION 1: DOM ELEMENT SELECTION 
const form = document.getElementById("search-form");
const queryInput = document.getElementById("query");
const statusMessage = document.getElementById("status-message");

const ipValue = document.getElementById("ip-value");
const locationValue = document.getElementById("location-value");
const timezoneValue = document.getElementById("timezone-value");
const ispValue = document.getElementById("isp-value");


//  SECTION 2: LEAFLET MAP SETUP 
const map = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: true,
}).setView([0, 0], 2);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const locationIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const marker = L.marker([0, 0], { icon: locationIcon }).addTo(map);


//  SECTION 3: API KEY 

const API_KEY = "at_Cj1Im1naGY0esnxLj0N3ys6fhlPaV";
const BASE_URL = "https://geo.ipify.org/api/v2/country,city";


// SECTION 4: INPUT VALIDATION
// Check what format the user typed so we send the right API parameter

function isIPv4(value) {
    return /^\d{1,3}(\.\d{1,3}){3}$/.test(value);
}

function isIPv6(value) {
    return value.includes(":") && /^[0-9a-fA-F:]+$/.test(value);
}

function isDomain(value) {
    return /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/.test(value);
}


//  SECTION 5: BUILD THE API URL 
// No query = API detects visitor's IP, IP = &ipAddress, domain = &domain

function buildApiUrl(query) {
    let url = BASE_URL + "?apiKey=" + API_KEY;
    if (!query) return url;

    const encoded = encodeURIComponent(query);

    if (isIPv4(query) || isIPv6(query)) {
        url += "&ipAddress=" + encoded;
    } else {
        url += "&domain=" + encoded;
    }

    return url;
}


// SECTION 6: FETCH LOCATION DATA
// async/await: fetch sends the request, await pauses until data arrives

async function fetchLocation(query) {
    const url = buildApiUrl(query);
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("API error: status " + response.status);
    }

    const data = await response.json();
    return data;
}


//  SECTION 7: UPDATE THE INFO CARDS 
function renderDetails(data) {
    ipValue.textContent = data.ip;

    const city = data.location.city || "";
    const region = data.location.region || "";
    const postalCode = data.location.postalCode || "";

    locationValue.textContent = [city, region, postalCode]
        .filter(Boolean)
        .join(", ");

    timezoneValue.textContent = "UTC " + data.location.timezone;
    ispValue.textContent = data.isp || "Unavailable";
}


//  SECTION 8: MOVE THE MAP AND MARKER 
// Geo.ipify gives lat/lng, Leaflet uses them to reposition

function renderMap(data) {
    const lat = data.location.lat;
    const lng = data.location.lng;

    map.setView([lat, lng], 13);
    marker.setLatLng([lat, lng]);
}


// SECTION 9: STATUS MESSAGES 
function setStatus(message) {
    statusMessage.textContent = message;
}