/* eslint-disable no-undef */
/**
 * move marker
 */

// config map
let config = {
  minZoom: 7,
  maxZoom: 18,
  keyboard: false,
};
// magnification with which the map will start
const zoom = 9;
// co-ordinates
const lat = 23.010683;
const lng = 75.660862;

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// ----------------------------------------------------------

// --- Simple arrow ---
var arrow = L.polyline([
  [22.719568, 75.857727],
  [22.962267, 76.050797]
], {}).addTo(map);
var arrowHead = L.polylineDecorator(arrow, {
  patterns: [{
    offset: '100%',
    repeat: 0,
    symbol: L.Symbol.arrowHead({
      pixelSize: 15,
      polygon: false,
      pathOptions: {
        stroke: true
      }
    })
  }]
}).addTo(map);

// --- Expanded view arrow ---
var multiCoords1 = [
  [
    [23.180491, 75.784121],
    [23.456516, 75.421467],
    [23.333126, 75.034023]
  ],

];
var plArray = [];
for (var i = 0; i < multiCoords1.length; i++) {
  plArray.push(L.polyline(multiCoords1[i]).addTo(map));
}
L.polylineDecorator(multiCoords1, {
  patterns: [{
    offset: 25,
    repeat: 50,
    symbol: L.Symbol.arrowHead({
      pixelSize: 15,
      pathOptions: {
        fillOpacity: 1,
        weight: 0
      }
    })
  }]
}).addTo(map);