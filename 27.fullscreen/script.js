/* eslint-disable no-undef */
/**
 * fullscreen
 */

// config map
let config = {
  minZoom: 7,
  maxZomm: 18,
  // https://github.com/Leaflet/Leaflet.fullscreen
  fullscreenControl: true,
};
// magnification with which the map will start
const zoom = 18;
// co-ordinates
const lat = 52.22977;
const lon = 21.01178;

// calling map
const map = L.map('map', config).setView([lat, lon], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
