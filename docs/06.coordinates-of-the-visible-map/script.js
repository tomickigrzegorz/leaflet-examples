/* eslint-disable no-undef */
/**
 * Obtaining coordinates of the visible map
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

const markerPlace = document.querySelector(".marker-position");

// on drag end
map.on("dragend", setRentacle);

// second option, by dragging the map
map.on("dragstart", updateInfo);

// on zoom end
map.on("zoomend", setRentacle);

// update info about bounds when site loaded
document.addEventListener("DOMContentLoaded", function () {
  const bounds = map.getBounds();
  updateInfo(bounds._northEast, bounds._southWest);
});

// set rentacle function
function setRentacle() {
  const bounds = map.getBounds();

  // update info about bounds
  updateInfo(bounds._northEast, bounds._southWest);

  // set rentacle
  L.rectangle(bounds, {
    color: randomColor(),
    weight: 20,
    fillOpacity: 0.1,
  }).addTo(map);

  // set map
  map.fitBounds(bounds);
}

// generate random color
function randomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

function updateInfo(north, south) {
  markerPlace.textContent =
    south === undefined
      ? "We are moving the map..."
      : `SouthWest: ${north}, NorthEast: ${south}`;
}
