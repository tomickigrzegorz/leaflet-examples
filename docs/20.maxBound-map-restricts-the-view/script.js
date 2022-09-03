/* eslint-disable no-undef */
/**
 * MaxBound map restricts the view
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

// When this option is set, the map restricts the view to the given geographical bounds, bouncing the user back if the user tries to pan outside the view. To set the restriction dynamically, use setMaxBounds method.

// coordinates limiting the map
function getBounds() {
  const southWest = new L.LatLng(52.228509, 21.008348);
  const northEast = new L.LatLng(52.231029, 21.01521);
  return new L.LatLngBounds(southWest, northEast);
}

// set maxBounds
map.setMaxBounds(map.getBounds());

// zoom the map to the polyline
map.fitBounds(getBounds(), { reset: true });
