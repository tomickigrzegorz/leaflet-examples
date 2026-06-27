/* eslint-disable no-undef */
/**
 * Map rotation with the leaflet-rotate plugin
 * https://github.com/tomickigrzegorz/leaflet-rotation
 *
 * Rotate the map by:
 *  - right mouse button + horizontal drag  (dragRotate)
 *  - Shift + scroll wheel                   (shiftKeyRotate)
 *  - two fingers / pinch-rotate on touch    (touchRotate)
 *  - the compass control (bottom-right)     (rotateCompassControl)
 * The arrow control (top-left) resets the bearing back to north.
 */

// co-ordinates
const lat = 52.22977;
const lng = 21.01178;

// calling map with rotation enabled
const map = L.map("map", {
  minZoom: 7,
  maxZoom: 18,
  center: [lat, lng],
  zoom: 15,
  // rotation system
  rotate: true,
  touchRotate: true,
  shiftKeyRotate: true,
  dragRotate: true,
  rotateControl: {
    position: "topleft",
    behavior: "reset",
    closeOnZeroBearing: false,
  },
});

// Used to load and display tile layers on the map
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// two normal (raster) icons loaded from a CDN
const shadowUrl =
  "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-shadow.png";

const blueIcon = L.icon({
  iconUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-blue.png",
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = L.icon({
  iconUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-red.png",
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// 5 markers - alternating between the two icons; the pins stay upright
// while the map rotates (only their position follows the rotation).
const markers = [
  { latlng: [52.22977, 21.01178], icon: redIcon, label: "Center (popup open)" },
  { latlng: [52.2335, 21.0175], icon: blueIcon, label: "Marker 2" },
  { latlng: [52.2262, 21.0212], icon: redIcon, label: "Marker 3" },
  { latlng: [52.2278, 21.0042], icon: blueIcon, label: "Marker 4" },
  { latlng: [52.2331, 21.0058], icon: redIcon, label: "Marker 5" },
];

markers.forEach((item, index) => {
  const marker = L.marker(item.latlng, {
    icon: item.icon,
    // Do NOT enable `rotateWithView` for a pin-shaped icon: it tilts the
    // whole pin with the map, so the tip stops pointing at its location.
    // Use it only for direction-aware icons (arrows, vehicles, heading cone).
    // rotateWithView: true,
  })
    .addTo(map)
    .bindPopup(item.label);

  // the first marker has its popup open by default
  if (index === 0) {
    marker.openPopup();
  }
});

// 3 paths (polylines)
const paths = [
  [
    [52.22977, 21.01178],
    [52.2335, 21.0175],
  ],
  [
    [52.22977, 21.01178],
    [52.2262, 21.0212],
  ],
  [
    [52.22977, 21.01178],
    [52.2331, 21.0058],
  ],
];

paths.forEach((path) => {
  L.polyline(path, {
    color: "#2a7de1",
    weight: 3,
    dashArray: "6 6",
  }).addTo(map);
});

// 3 polygons
const polygons = [
  {
    coords: [
      [52.2345, 21.0],
      [52.2365, 21.006],
      [52.2335, 21.009],
    ],
    color: "#fe4848",
  },
  {
    coords: [
      [52.224, 20.998],
      [52.2225, 21.004],
      [52.2255, 21.006],
    ],
    color: "#37b24d",
  },
  {
    coords: [
      [52.2245, 21.024],
      [52.2275, 21.028],
      [52.2235, 21.03],
    ],
    color: "#f59f00",
  },
];

polygons.forEach((polygon) => {
  L.polygon(polygon.coords, {
    color: polygon.color,
    weight: 2,
    fillOpacity: 0.3,
  }).addTo(map);
});

// show the current bearing in the page title while rotating
map.on("rotate", () => {
  document.title = `Map rotation – ${Math.round(map.getBearing())}°`;
});
