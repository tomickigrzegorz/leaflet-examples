/* eslint-disable no-undef */
/**
 * Controlling the map from outside the map
 */

// config map
let config = {
  minZoom: 7,
  maxZoom: 18,
};
// magnification with which the map will start
const zoom = 17;
// coordinates
const lat = 52.22977;
const lng = 21.01178;

// coordinate array with popup text
const points = [
  [52.228785157729114, 21.006867885589603, "A", "point 1"],
  [52.22923201880194, 21.00897073745728, "B", "point 2"],
  [52.22963944703663, 21.01091265678406, "C", "point 3"],
  [52.229928587386496, 21.01218938827515, "D", "point 4"],
];

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// we create an array of markers
// each marker has a unique title
// of course this could be another parameter
const container = document.querySelector(".container");
const featureGroups = [];
for (let i = 0; i < points.length; i++) {
  const [lat, lng, title] = points[i];

  const marker = L.marker([lat, lng], { title });
  marker
    .bindPopup(`${title}, ${marker.toString()}`)
    .addTo(map)
    .on("click", clickZoom);

  const el = document.createElement("a");
  el.id = marker._leaflet_id;
  el.className = "marker-click";
  el.href = "#";
  el.textContent = `Marker ${title}`;
  container.appendChild(el);
}

// set center map
function clickZoom(e) {
  map.setView(e.target.getLatLng(), zoom);

  setActive(e.target._leaflet_id);
}

// function that opens a popup with text at the marker
// and transfers latLng coordinates of the opened marker
// to the centering function
function markerOpen(id) {
  map.eachLayer(function (layer) {
    if (layer.options && layer._leaflet_id === id) {
      centerMarker(layer);

      setActive(id);
    }
  });
}

// set active class
function setActive(id) {
  const active = document.querySelector(".active");
  if (active) {
    active.classList.remove("active");
  }
  const el = document.getElementById(id);
  el.classList.add("active");
}

// function open popup and centering
// the map on the marker
function centerMarker(layer) {
  layer.openPopup();
  map.panTo(L.latLng(layer.getLatLng()));
}

// all marker-click classes from html
document.addEventListener("DOMContentLoaded", () => {
  const markersDiv = document.querySelectorAll(".marker-click");

  markersDiv.forEach((marker) => {
    marker.addEventListener("click", () => {
      // the click event transfers to the function
      // id = title of the marker
      // convert id to number

      markerOpen(+marker.id);
    });
  });
});
