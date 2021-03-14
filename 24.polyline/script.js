/* eslint-disable no-undef */
/**
 * Polyline
 */

// config map
let config = {
  minZoom: 7,
  maxZomm: 18,
};
// magnification with which the map will start
const zoom = 18;
// co-ordinates
const lat = 52.22999;
const lng = 21.01258;

// calling map
const map = L.map('map', config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// define array of points to use for line
const points = [
  [52.2308124251888, 21.011003851890568],
  [52.2302604393307, 21.01121842861176],
  [52.2297445891999, 21.011282801628116],
  [52.22953759032849, 21.011492013931278],
  [52.22954416173605, 21.01194798946381],
  [52.22967558968336, 21.012285947799686],
  [52.2300008721797, 21.012935042381287],
  [52.230306438414374, 21.014378070831302],
];

// add polyline to map
L.polyline(points, {
  color: 'red',
  opacity: 0.5,
  weight: 20,
})
  .bindPopup('polygon')
  .addTo(map);
