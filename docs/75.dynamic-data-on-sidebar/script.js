/* eslint-disable no-undef */
/**
 * data on sidebar
 */

// config map
const config = {
  minZoom: 7,
  maxZoom: 18,
};
// magnification with which the map will start
const zoom = 11;
// co-ordinates
const lat = 22.72299;
const lng = 75.864716;

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
}

// coordinate array points
const points = [
  [23.4561, 75.4227],
  [22.72299, 75.864716],
  [22.962187, 76.05011],
  [23.187076, 75.769958],
  [22.243344, 76.133881],
];

const fg = L.featureGroup().addTo(map);

points.forEach((point) => {
  const marker = L.marker(point).addTo(fg);
  const getLatLong = marker.getLatLng();
  marker.bindPopup(getLatLong.toString());
});

listMarkers();

//Create Elements for markers in bound
function listMarkers() {
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      if (map.getBounds().contains(layer.getLatLng()) === true) {
        createSidebarElements(layer);
      }
    }
  });
}

//Event fired when user stopped dragging the map
map.on("moveend", (e) => {
  sidebar.innerHTML = "";
  listMarkers();
});
