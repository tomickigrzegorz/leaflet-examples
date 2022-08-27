/* eslint-disable no-undef */
/**
 * markers 60K
 */

// config map
let config = {
  minZoom: 1,
  maxZoom: 5,
  preferCanvas: true,
};
// magnification with which the map will start
const zoom = 1;
// co-ordinates
const lat = 0;
const lng = 0;

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// we assign a marker layer to the variable
let markers = L.markerClusterGroup();

// we create markers that we add to the layer
for (let i = 0; i < 60000; i += 1) {
  // circleMarker are canvas markers
  let marker = L.circleMarker(getRandomLatLng());
  markers.bindPopup("marker " + i);
  markers.addLayer(marker);
}

// generating random marker coordinates
function getRandomLatLng() {
  return [-70 + 140 * Math.random(), -180 + 360 * Math.random()];
}

// adding markers to the map
map.addLayer(markers);
