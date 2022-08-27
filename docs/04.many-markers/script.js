/* eslint-disable no-undef */
/**
 * Many markers
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

// coordinate array with popup text
let points = [
  [52.230020586193795, 21.01083755493164, "point 1"],
  [52.22924516170657, 21.011320352554325, "point 2"],
  [52.229511304688444, 21.01270973682404, "point 3"],
  [52.23040500771883, 21.012146472930908, "point 4"],
];

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// loop that adds many markers to the map
for (let i = 0; i < points.length; i++) {
  const [lat, lng, popupText] = points[i];

  marker = new L.marker([lat, lng]).bindPopup(popupText).addTo(map);
}
