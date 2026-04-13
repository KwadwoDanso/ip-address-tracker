# Frontend Mentor - IP Address Tracker Solution

This is my solution to the [IP address tracker challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/ip-address-tracker-I8-0yYAH0).

## Table of contents

- [Overview](#overview)
- [Screenshot](#screenshot)
- [Links](#links)
- [My process](#my-process)
- [Author](#author)

## Overview

An application that tracks and displays the location of a given IP address using the IP Geolocation API by IPify  and LeafletJS  for map rendering.

### The challenge

Users should be able to:

- View the optimal layout for each page depending on their device's screen size
- See hover states for all interactive elements on the page
- See their own IP address on the map on the initial page load
- Search for any IP addresses or domains and see the key information and location

### Screenshot

![Desktop Screenshot]("C:\Users\Kwadw\OneDrive\Pictures\Screenshots\Screenshot 2026-04-13 080555.png")

### Links

- Solution URL: [GitHub Repository](https://github.com/KwadwoDanso/ip-address-tracker)
- Live Site URL: [Live Demo](https://kd-ip-addy.netlify.app/)

## My process
- Built semantic HTML with header, search form, detail cards, and map container
- Added CSS using Flexbox for the search row and CSS Grid for the detail cards
- Added responsive media queries for mobile, tablet, and desktop
- Initialized Leaflet map with tile layer and marker
- Connected Geo.ipify API with async/await fetch
- Rendered API response data into the four info cards
- Connected API coordinates to Leaflet map to move the marker
- Added form submit handler with error handling
- Added accessibility: skip link, visible label, aria-live status, focus styles
- Deployed to Netlify

### Built with

- Semantic HTML5 markup (header, main, form, dl, dt, dd)
- CSS custom properties
- Flexbox (search row, body layout)
- CSS Grid (detail cards: 1 → 2 → 4 columns)
- Mobile-first responsive design
- [Geo.ipify API](https://geo.ipify.org/) — IP geolocation data
- [LeafletJS](https://leafletjs.com/) — interactive map rendering
- [OpenStreetMap](https://www.openstreetmap.org/) — map tile images

### What I learned

Connecting two APIs was the core lesson. Geo.ipify returns data including latitude and longitude. Leaflet takes those coordinates and positions the map and marker. The data flows from one directly into the other:


// Geo.ipify gives us coordinates, Leaflet uses them
function renderMap(data) {
  const lat = data.location.lat;
  const lng = data.location.lng;
  map.setView([lat, lng], 13);
  marker.setLatLng([lat, lng]);
}


I also practiced making the app accessible with semantic HTML, visible focus styles, a search landmark, and an aria-live status region.

### Continued development

- Move the API key behind a serverless function
- Add a loading spinner
- Cache recent searches
- Improve input validation

### Useful resources

- [Geo.ipify API Docs](https://geo.ipify.org/docs) — API endpoint reference
- [Leaflet Quick Start](https://leafletjs.com/examples/quick-start/) — map setup guide
- [MDN: ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions) — dynamic update announcements
- [w3 schools](https://www.w3schools.com/jsref/api_web.asp) - js web API 
- per scholas 

## Author

- Kwadwo Danso


### Reflection
# Reflection

I built the Frontend Mentor IP Address Tracker using semantic HTML, CSS, and JavaScript. The app uses the Geo.ipify API to fetch IP geolocation data and LeafletJS to render an interactive map. On page load, it detects the visitor's public IP and displays the location. Users can search by IP address or domain to look up other locations.

The biggest challenge was connecting the API response to the map. Geo.ipify returns data including latitude and longitude as JSON fields. Leaflet needs those exact coordinates to position the map and marker. Once I realized the output of one is the input of the other, the architecture made sense. Building the map first with temporary coordinates, then swapping in real API values, made debugging much simpler.

For the layout, I used Flexbox for the search row so the input and button sit side by side and stack on smaller screens. I used CSS Grid for the detail cards so they display in one column on mobile, two on tablet, and four on desktop with media queries. 

Accessibility was important throughout. I used semantic HTML elements like header, main, form, and dl. The search input has a screen-reader label, the form uses role="search" as a landmark, and an aria-live region announces loading and error status. I added a skip link and visible focus styles for keyboard navigation.

If I had more time iwould cache recent searches. This project strengthened my understanding of API integration, responsive CSS, and building accessible interfaces.