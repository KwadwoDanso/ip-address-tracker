
// IP ADDRESS TRACKER — script.js
//
// Two APIs work together:
//   1. Geo.ipify — fetches IP geolocation data as JSON
//   2. LeafletJS — renders an interactive map using lat/lng
//
// Data flow:
//   User types input → validate → build URL → fetch from Geo.ipify
//   → update the 4 info cards → move the Leaflet map and marker

// SECTION 1: DOM ELEMENT SELECTION
// document.getElementById() finds an HTML element by its id
// and gives us a JavaScript reference we can read/write to.

// Form elements
const form = document.getElementById("search-form");
const queryInput = document.getElementById("query");
const statusMessage = document.getElementById("status-message");

// The four detail card values — updated with API data
const ipValue = document.getElementById("ip-value");
const locationValue = document.getElementById("location-value");
const timezoneValue = document.getElementById("timezone-value");
const ispValue = document.getElementById("isp-value");



// SECTION 2: LEAFLET MAP SETUP
// The map is created ONCE on page load.
// Later we just call setView() and setLatLng() to move it.

// L.map("map") — creates a map inside the div with id="map"
// .setView([lat, lng], zoom) — starting center and zoom level
const map = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: true,
}).setView([0, 0], 2);

// L.tileLayer() — adds map tile images from OpenStreetMap
// .addTo(map) — attaches this layer to our map
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Custom icon matching the Frontend Mentor design (black location pin)
const locationIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// L.marker() — creates a pin on the map (we move it later)
const marker = L.marker([0, 0], { icon: locationIcon }).addTo(map);



// SECTION 3: API KEY

const API_KEY = "at_Cj1Im1naGY0esnxLj0N3ys6fhlPaV";

// The "country,city" endpoint returns city-level fields:
// ip, location.city, location.region, location.lat, location.lng,
// location.postalCode, location.timezone, isp
const BASE_URL = "https://geo.ipify.org/api/v2/country,city";



// SECTION 4: INPUT VALIDATION
// Check what the user typed so we send the right API parameter

// IPv4 looks like: 8.8.8.8 (four groups of digits separated by dots)
function isIPv4(value) {
    return /^\d{1,3}(\.\d{1,3}){3}$/.test(value);
}

// IPv6 looks like: 2001:4860:4860::8888 (hex chars and colons)
function isIPv6(value) {
    return value.includes(":") && /^[0-9a-fA-F:]+$/.test(value);
}

// Domain looks like: google.com (letters, numbers, hyphens, at least one dot)
function isDomain(value) {
    return /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/.test(value);
}



// SECTION 5: BUILD THE API URL
// Three scenarios:
//   1. No query → API defaults to visitor's own public IP
//   2. IP address → appends &ipAddress=...
//   3. Domain → appends &domain=...

function buildApiUrl(query) {
    // Start with base URL + required API key
    let url = BASE_URL + "?apiKey=" + API_KEY;

    // No query = detect visitor's IP (Geo.ipify default behavior)
    if (!query) return url;

    // Make the input safe for a URL
    const encoded = encodeURIComponent(query);

    // Append the right parameter based on input type
    if (isIPv4(query) || isIPv6(query)) {
        url += "&ipAddress=" + encoded;
    } else {
        url += "&domain=" + encoded;
    }

    return url;
}



// SECTION 6: FETCH LOCATION DATA
// async/await:
//   async = this function will do waiting
//   await = pause here until the data arrives
// fetch(url) = send an HTTP request to the API
// response.ok = true if status 200-299, false if 400+
// response.json() = parse the JSON body into a JS object

async function fetchLocation(query) {
    const url = buildApiUrl(query);
    const response = await fetch(url);

    // Geo.ipify error codes: 401 (bad key), 403 (no credits),
    // 422 (bad input), 429 (rate limited)
    if (!response.ok) {
        throw new Error("API error: status " + response.status);
    }

    const data = await response.json();
    return data;
}


// SECTION 7: UPDATE THE INFO CARDS
// Puts each API field into its matching card's <dd> element

function renderDetails(data) {
    // IP Address card
    ipValue.textContent = data.ip;

    // Location card — combine city, region, and postal code
    // || "" prevents errors if a field is missing
    const city = data.location.city || "";
    const region = data.location.region || "";
    const postalCode = data.location.postalCode || "";

    // filter(Boolean) removes empty strings, join combines with commas
    locationValue.textContent = [city, region, postalCode]
        .filter(Boolean)
        .join(", ");

    // Timezone card — API returns "-07:00", we prepend "UTC"
    timezoneValue.textContent = "UTC " + data.location.timezone;

    // ISP card
    ispValue.textContent = data.isp || "Unavailable";
}



// SECTION 8: MOVE THE MAP AND MARKER
// This connects the two APIs:
//   Geo.ipify gives us lat and lng
//   Leaflet uses them to reposition the map view and marker pin

function renderMap(data) {
    const lat = data.location.lat;
    const lng = data.location.lng;

    // Move the map center to the new coordinates
    map.setView([lat, lng], 13);

    // Move the marker pin to the same coordinates
    marker.setLatLng([lat, lng]);
}


// SECTION 9: STATUS MESSAGES
// Updates the aria-live="polite" paragraph.
// Screen readers announce this text automatically.
function setStatus(message) {
    statusMessage.textContent = message;
}



// SECTION 10: MASTER LOAD FUNCTION
// Runs the full flow: fetch → render cards → move map
// try/catch:
//   try 
//   catch 
//   Prevents the app from crashing

async function loadLocation(query) {
    try {
        setStatus("Loading...");

        const data = await fetchLocation(query);

        renderDetails(data);
        renderMap(data);

        setStatus("Location updated for " + data.ip);
    } catch (error) {
        setStatus("Could not find that address. Please try again.");
        console.error("Fetch error:", error);
    }
}



// SECTION 11: FORM SUBMIT HANDLER
// Fires when user clicks Search or presses Enter

form.addEventListener("submit", function (event) {
    // Stop the page from reloading (default form behavior)
    event.preventDefault();

    // Get input and remove extra whitespace
    const query = queryInput.value.trim();

    // Validation: empty input
    if (!query) {
        setStatus("Please enter an IP address or domain.");
        queryInput.focus();
        return;
    }

    // Validation: unrecognized format
    if (!isIPv4(query) && !isIPv6(query) && !isDomain(query)) {
        setStatus("Please enter a valid IP address or domain name.");
        queryInput.focus();
        return;
    }

    // Run the search
    loadLocation(query);
});



// SECTION 12: INITIAL PAGE LOAD
// Empty string = no ipAddress param = API detects visitor's public IP
loadLocation("");