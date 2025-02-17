/* eslint-disable no-undef */
/**
 * Draw dynamic circles between two points
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
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

map.on("click", function (e) {
  console.log(e.latlng);
});

// ----------------------------------------

const points = [
  [52.230086299510894, 21.010832190513614],
  [52.22933387621115, 21.01271510124207],
];

// Table for storing current markers
let circleMarkers = [];

function addInterpolatedMarkers(map, points) {
  // Remove previous circleMarkers
  circleMarkers.forEach((marker) => map.removeLayer(marker));
  circleMarkers = [];

  const [start, end] = points.map((p) => L.latLng(p[0], p[1]));
  const totalDistance = start.distanceTo(end);
  const zoomLevel = map.getZoom();

  // Base step distance
  const baseStepDistance = 6;
  // Adjust step distance based on zoom level (higher zoom -> denser markers)
  const stepDistance = baseStepDistance / Math.pow(1.7, zoomLevel - 20);
  const numMarkers = Math.max(1, Math.floor(totalDistance / stepDistance));

  for (let i = 1; i <= numMarkers; i++) {
    const lat = start.lat + (i / (numMarkers + 1)) * (end.lat - start.lat);
    const lng = start.lng + (i / (numMarkers + 1)) * (end.lng - start.lng);

    const circleMarker = L.circleMarker([lat, lng], {
      radius: 6,
      fillColor: "#ff4800",
      fillOpacity: 1,
      stroke: false,
    }).addTo(map);

    circleMarkers.push(circleMarker);
  }
}

// We add draggable markers and handle their movement
const draggableMarkers = points.map((point, index) => {
  const marker = L.marker(point, { draggable: true }).addTo(map);

  marker.on("drag", () => {
    // Update the coordinates of the points
    points[index] = [marker.getLatLng().lat, marker.getLatLng().lng];
    // Refresh circleMarkers
    addInterpolatedMarkers(map, points);
  });

  return marker;
});

// Update markers when zooming
map.on("zoomend", () => addInterpolatedMarkers(map, points));

// Initial drawing of circleMarkers
addInterpolatedMarkers(map, points);
