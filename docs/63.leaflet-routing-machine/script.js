/* eslint-disable no-undef */
/**
 * leaflet routing machine
 */

// config map
let config = {
  minZoom: 7,
  maxZoom: 18,
};
// magnification with which the map will start
const zoom = 15;
// co-ordinates
const lat = 52.23397;
const lng = 21.01489;

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// add legend
// ------------------------------
const legend = L.control({ position: "bottomleft" });

legend.onAdd = function () {
  let div = L.DomUtil.create("div", "description");
  L.DomEvent.disableClickPropagation(div);
  const text = "Try to move one of the markers";
  div.insertAdjacentHTML("beforeend", text);
  return div;
};

legend.addTo(map);

// --------------------------------------------------
// Routing

L.Routing.control({
  waypoints: [
    L.latLng(52.23534304973193, 21.008391380310062),
    L.latLng(52.23163710555889, 21.020493507385257),
  ],
  routeWhileDragging: true,
  lineOptions: {
    styles: [{ color: "red", opacity: 0.7, weight: 8 }],
  },
}).addTo(map);

// --------------------------------------------------
// more examples on https://www.liedman.net/leaflet-routing-machine/
