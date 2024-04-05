/* eslint-disable no-undef */
/**
 * move marker
 */

// config map
let config = {
  minZoom: 7,
  maxZoom: 18,
  keyboard: false,
};
// magnification with which the map will start
const zoom = 8;
// co-ordinates
const lat = 23.010683;
const lng = 75.660862;

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// ----------------------------------------------------------

// --- Simple arrow ---
const arrow = L.polyline(
  [
    [22.719568, 75.857727],
    [22.962267, 76.050797],
  ],
  {},
).addTo(map);
const arrowHead = L.polylineDecorator(arrow, {
  patterns: [
    {
      offset: "100%",
      repeat: 0,
      symbol: L.Symbol.arrowHead({
        pixelSize: 15,
        polygon: false,
        pathOptions: {
          stroke: true,
        },
      }),
    },
  ],
}).addTo(map);

// --- Expanded view arrow ---
const multiCoords1 = [
  [
    [23.180491, 75.784121],
    [23.456516, 75.421467],
    [23.333126, 75.034023],
  ],
];
let plArray = [];
for (let i = 0; i < multiCoords1.length; i++) {
  plArray.push(L.polyline(multiCoords1[i]).addTo(map));
}
L.polylineDecorator(multiCoords1, {
  patterns: [
    {
      offset: 25,
      repeat: 50,
      symbol: L.Symbol.arrowHead({
        pixelSize: 15,
        pathOptions: {
          fillOpacity: 1,
          weight: 0,
        },
      }),
    },
  ],
}).addTo(map);

// --- Example with a rotated marker ---

const cords = [
  [22.9, 75],
  [22.18, 75.1],
  [22.61, 76.4],
];

const pathPattern = L.polylineDecorator(cords, {
  patterns: [
    {
      offset: "0",
      repeat: map.getZoom() * 4,
      symbol: L.Symbol.marker({
        rotate: true,
        markerOptions: {
          icon: L.divIcon({
            html: '<div class="arrow-single"><svg viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg"><path stroke-width="3.232" d="M12.5 2.976v18.936m-5.686-7.125 5.686 7.125m5.686-7.124L12.5 21.912"/></svg></div>',
            iconSize: [30, 30],
          }),
        },
      }),
    },
  ],
}).addTo(map);

// ----------------------------------------------
// add class to marker icon

map.eachLayer(function () {
  addClassNameToMarker();
});

map.on("zoomend", function () {
  addClassNameToMarker();
});

function addClassNameToMarker() {
  map.eachLayer(function (layer) {
    if (layer instanceof L.Marker) {
      layer._icon.classList.add("arrow-marker");
    }
  });
}

const getColor = document.querySelector(".color");

getColor.addEventListener("input", (e) => {
  const color = e.target.value;
  const svg = document.querySelectorAll(".arrow-single svg");
  svg.forEach((el) => {
    el.querySelector("path").style.stroke = color;
  });
});
