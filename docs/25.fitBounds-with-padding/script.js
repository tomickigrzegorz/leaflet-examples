/* eslint-disable no-undef */
/**
 * fitBounds with padding
 */

// config map
let config = {
  minZoom: 7,
  maxZoom: 18,
  zoomControl: false, // zoom control off
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

// reactivate zoom at the desired location
// [topleft, topright, bottomleft, bottomright]
L.control.zoom({ position: "topright" }).addTo(map);

// one marker
const marker = L.marker([lat, lng]).bindPopup("Center Warsaw");

function fitBoundsPadding() {
  // get with info div
  const boxInfoWith = document.querySelector(".info").offsetWidth;

  // create a feature group, optionally given an initial set of layers
  const featureGroup = L.featureGroup([marker]).addTo(map);

  // sets a map view that contains the given geographical bounds
  // with the maximum zoom level possible
  map.fitBounds(featureGroup.getBounds(), {
    // https://leafletjs.com/reference-1.6.0.html#fitbounds-options-paddingtopleft
    paddingTopLeft: [boxInfoWith + 10, 10],
  });
}

// trigger function on dom content loaded
window.addEventListener("DOMContentLoaded", fitBoundsPadding);

// trigger function resize window with performant on resize
let timeout;
window.addEventListener(
  "resize",
  () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fitBoundsPadding();
    }, 75);
  },
  false
);
