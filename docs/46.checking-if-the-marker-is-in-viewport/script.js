/* eslint-disable no-undef */
/**
 * Checking if the marker is in viewport
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

// create legend
// ------------------------------

const legend = L.control({ position: "bottomleft" });

legend.onAdd = function () {
  let div = L.DomUtil.create("div", "description");
  L.DomEvent.disableClickPropagation(div);
  const text = `We check if the marker is in the page view. Move the marker so that it is outside the map.<br>Marker in view: <b class="checkMarker">true</b>`;
  div.insertAdjacentHTML("beforeend", text);
  return div;
};

legend.addTo(map);

// ------------------------------

// add marker to map
const marker = L.marker([52.22983, 21.011728])
  .addTo(map)
  .bindPopup("Center Warsaw");

// check if marker is in viewport
function markerInMapView() {
  // add polygon to map
  const mapBounds = map.getBounds();

  // check if map contains marker
  const contains = mapBounds.contains(marker.getLatLng());

  // add class to legend info about marker
  const markerInfo = document.querySelector(".checkMarker");
  markerInfo.textContent = contains;

  // change marker color
  markerInfo.classList[contains ? "remove" : "add"]("color-red");
}

// check if marker is in viewport on moveend map
map.on("moveend", function () {
  markerInMapView();
});
