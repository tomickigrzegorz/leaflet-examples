/**
 * Controlling the map from outside the map
 */

// config map
let config = {
  minZoom: 7,
  maxZomm: 18,
};
// magnification with which the map will start
const zoom = 17;
// coordinates
const lat = 52.2297700;
const lon = 21.0117800;

// coordinate array with popup text
const points = [
  [52.228785157729114, 21.006867885589603, 'A', 'point 1'],
  [52.22923201880194, 21.00897073745728, 'B', 'point 2'],
  [52.22963944703663, 21.01091265678406, 'C', 'point 3'],
  [52.229928587386496, 21.01218938827515, 'D', 'point 4']
];

// calling map
const map = L.map('map', config).setView([lat, lon], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// we create an array of markers
// each marker has a unique title
// of course this could be another parameter
const featureGroups = [];
for (let i = 0; i < points.length; i++) {
  featureGroups.push(L.marker([points[i][0], points[i][1]], { title: points[i][2] }).bindPopup(points[i][3]));
}

// we add markers to the map
for (let i = 0; i < featureGroups.length; i++) {
  featureGroups[i].addTo(map);
}

// function that opens a popup with text at the marker
// and transfers latLng coordinates of the opened marker
// to the centering function
function markerOpen(id) {
  for (let i in featureGroups) {
    const markerId = featureGroups[i].options.title;
    if (markerId === id) {
      featureGroups[i].openPopup();
      centerMarker(featureGroups[i].getLatLng());
    }
  }
}

// function centering the map on the marker
function centerMarker(latlng) {
  const marker = L.marker([latlng.lat, latlng.lng]);
  let group = new L.featureGroup([marker]);
  map.fitBounds(group.getBounds());
}

// all marker-click classes from html
document.addEventListener('DOMContentLoaded', () => {
  const markersDiv = document.querySelectorAll('.marker-click');

  markersDiv.forEach(marker => {
    marker.addEventListener('click', () => {
      // the click event transfers to the function
      // id = title of the marker
      markerOpen(marker.id);
    });
  });
});
