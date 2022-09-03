/* eslint-disable no-undef */
/**
 * add move and delete marker
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

// add marker on click
map.on("click", addMarker);

function addMarker(e) {
  // Add marker to map at click location
  const markerPlace = document.querySelector(".marker-position");
  markerPlace.textContent = `new marker: ${e.latlng.lat}, ${e.latlng.lng}`;

  const marker = new L.marker(e.latlng, {
    draggable: true,
  })
    .addTo(map)
    .bindPopup(buttonRemove);

  // event remove marker
  marker.on("popupopen", removeMarker);

  // event draged marker
  marker.on("dragend", dragedMaker);
}

const buttonRemove =
  '<button type="button" class="remove">delete marker 💔</button>';

const markerPlace = document.querySelector(".marker-position");

// remove marker
function removeMarker() {
  const marker = this;
  const btn = document.querySelector(".remove");
  btn.addEventListener("click", function () {
    markerPlace.textContent = "goodbye marker 💩";
    map.removeLayer(marker);
  });
}

// draged
function dragedMaker() {
  markerPlace.textContent = `change position: ${this.getLatLng().lat}, ${
    this.getLatLng().lng
  }`;
}
