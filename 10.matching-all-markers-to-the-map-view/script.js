/* eslint-disable no-undef */
/**
 * Matching all markers to the map view
 */

// config map
let config = {
  minZoom: 7,
  maxZoom: 18,
};
// magnification with which the map will start
const zoom = 18;
// coordinates
const lat = 52.22977;
const lng = 21.01178;

// coordinate array with popup text
const points = [
  [52.22966244690615, 21.011084318161014, "point 1"],
  [52.234616998160874, 21.008858084678653, "point 2"],
  [52.22998444382795, 21.012511253356937, "point 3"],
  [52.22858801170828, 21.00593984127045, "point 4"],
];

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// adding all markers to the featureGroups array
let featureGroups = [];
for (let i = 0; i < points.length; i++) {
  const [lat, lng, title] = points[i];
  featureGroups.push(L.marker([lat, lng]).bindPopup(title));
}

// adding all markers to the map
for (let i = 0; i < featureGroups.length; i++) {
  featureGroups[i].addTo(map);
}

// Extended `LayerGroup` that makes it easy
// to do the same for all layers of its members
let group = new L.featureGroup(featureGroups);

// method fitBounds sets a map view that
// contains the given geographical bounds
map.fitBounds(group.getBounds(), {
  padding: [50, 50], // adding padding to map
});
