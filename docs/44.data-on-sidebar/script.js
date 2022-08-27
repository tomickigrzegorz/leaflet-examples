/* eslint-disable no-undef */
/**
 * data on sidebar
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

// --------------------------------------------------

const sidebar = document.getElementById("sidebar");

function createSidebarElements(layer) {
  const el = `<div class="sidebar-el" data-marker="${layer._leaflet_id}">${layer
    .getLatLng()
    .toString()}</div>`;

  const temp = document.createElement("div");
  temp.innerHTML = el.trim();
  const htmlEl = temp.firstChild;

  L.DomEvent.on(htmlEl, "click", zoomToMarker);
  sidebar.insertAdjacentElement("beforeend", htmlEl);
}

function zoomToMarker(e) {
  const clickedEl = e.target;
  const markerId = clickedEl.getAttribute("data-marker");
  const marker = fg.getLayer(markerId);
  const getLatLong = marker.getLatLng();

  marker.bindPopup(getLatLong.toString()).openPopup();
  map.panTo(getLatLong);
}

// coordinate array points
const points = [
  [52.230020586193795, 21.01083755493164],
  [52.22924516170657, 21.011320352554325],
  [52.229511304688444, 21.01270973682404],
  [52.23040500771883, 21.012146472930908],
];

const fg = L.featureGroup().addTo(map);

points.forEach((point) => {
  const marker = L.marker(point).addTo(fg);
  createSidebarElements(marker);
});

map.fitBounds(fg.getBounds());
