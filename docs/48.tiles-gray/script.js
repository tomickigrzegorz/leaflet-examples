/* eslint-disable no-undef */
/**
 * tiles gray
 */

// config map
let config = {
  minZoom: 7,
  maxZoom: 18,
};
// magnification with which the map will start
const zoom = 18;
// co-ordinates
const lat = 52.22977;
const lng = 21.01178;

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// -------------------------------------------

// The best way to add the following code to your style

// .leaflet-tile-container {
//  filter: grayscale(1)
// }

// Or -----------------------------------------

const style = document.createElement("style");
style.textContent = `.leaflet-tile-container { filter: grayscale(1)}`;
document.head.appendChild(style);
