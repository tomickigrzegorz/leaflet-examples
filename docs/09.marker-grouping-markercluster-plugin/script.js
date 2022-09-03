/* eslint-disable no-undef */
/**
 * Marker grouping width markercluster plugin
 */

// config map
let config = {
  minZoom: 6,
  maxZoom: 18,
};
// magnification with which the map will start
const zoom = 6;
// coordinates
const lat = 51.9189046;
const lng = 19.1343786;

// coordinate array with popup text
let points = [
  [52.22922544734814, 21.008997559547428, "point 1"],
  [52.22941930482576, 21.009861230850223, "point 2"],
  [52.22966244690615, 21.011084318161014, "point 3"],
  [52.22980701724154, 21.01167440414429, "point 4"],
  [52.22998444382795, 21.012511253356937, "point 5"],
  [52.230188154960125, 21.013487577438358, "point 6"],
  [52.230299867119605, 21.01395428180695, "point 7"],
  [51.26191485308451, 17.753906250000004, "point 8"],
  [51.23440735163461, 17.578125000000004, "point 9"],
  [50.84757295365389, 17.753906250000004, "point 10"],
  [50.90303283111257, 18.061523437500004, "point 11"],
  [51.04139389812637, 17.446289062500004, "point 12"],
];

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// L.MarkerClusterGroup extends L.FeatureGroup
// by clustering the markers contained within
let markers = L.markerClusterGroup();

// Add markers to the layer
for (let i = 0; i < points.length; i++) {
  const [lat, lng, title] = points[i];

  let marker = L.marker(new L.LatLng(lat, lng)).bindPopup(title);
  markers.addLayer(marker);
}

// Add all markers to map
map.addLayer(markers);
