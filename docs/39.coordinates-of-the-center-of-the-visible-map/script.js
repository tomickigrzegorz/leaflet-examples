/* eslint-disable no-undef */
/**
 * Coordinates of the center of the visible map
 */

// config map
let config = {
  minZoom: 3,
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

// on drag end
map.on("dragend", updateInfo);

// on zoom end
map.on("zoomend", updateInfo);

// create legend
const coordinates = L.control({ position: "bottomleft" });

coordinates.onAdd = function () {
  const div = L.DomUtil.create("div", "center-of-map-description");
  L.DomEvent.disableClickPropagation(div);
  return div;
};

coordinates.addTo(map);

// update info about bounds when site loaded
document.addEventListener("DOMContentLoaded", function () {
  updateInfo();
});

const markerPlace = document.querySelector(".center-of-map-description");

function updateInfo() {
  const { lat, lng } = map.getCenter();
  const zoom = map.getZoom();
  markerPlace.innerHTML = `center: ${lat.toFixed(5)}, ${lng.toFixed(
    5
  )} | zoom: ${zoom}`;
}
