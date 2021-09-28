/* eslint-disable no-undef */
/**
 * Back to home button
 */

// config map
let config = {
  minZoom: 7,
  maxZomm: 18,
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
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const htmlTemplate =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M32 18.451L16 6.031 0 18.451v-5.064L16 .967l16 12.42zM28 18v12h-8v-8h-8v8H4V18l12-9z" /></svg>';

// create custom button
const customControl = L.Control.extend({
  // button position
  options: {
    position: "topleft",
  },

  // method
  onAdd: function (map) {
    console.log(map.getCenter());
    // create button
    const btn = L.DomUtil.create("button");
    btn.title = "back to home";
    btn.innerHTML = htmlTemplate;
    btn.className = "back-to-home";
    btn.setAttribute(
      "style",
      "width: 26px; height: 26px; margin-top: 0; border: none; left: 0; display: none; cursor: pointer; justify-content: center; font-size: 2rem;"
    );

    return btn;
  },
});

// adding new button to map controll
map.addControl(new customControl());

const button = document.querySelector(".back-to-home");

// on drag end
map.on("dragend", getCenterOfMap);

// on zoom end
map.on("zoomend", getCenterOfMap);

function getCenterOfMap() {
  const { lat, lng } = map.getCenter();
  const latDZ = lat.toFixed(5) * 1;
  const lngDZ = lng.toFixed(5) * 1;

  arrayCheckAndClick([latDZ, lngDZ]);
}

// compare two arrays, if arrays diffrent show button home-back
function arrayCheckAndClick(array) {
  const IfTheDefaultLocationIsDifferent =
    [lat, lng].sort().join(",") !== array.sort().join(",");

  button.style.display = IfTheDefaultLocationIsDifferent ? "flex" : "none";

  // clicking on home-back set default view and zoom
  button.addEventListener("click", function () {
    // more fancy back to previous place
    map.flyTo([lat, lng], zoom);
    button.style.display = "none";
  });
}
