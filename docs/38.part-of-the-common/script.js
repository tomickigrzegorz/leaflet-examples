/* eslint-disable no-undef */
/**
 * part of the common turfjs
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

// three coordinate
const centers = [
  { lat: 52.22990558765487, lng: 21.01168513298035 },
  { lat: 52.22962958994604, lng: 21.011593937873844 },
  { lat: 52.2297445891999, lng: 21.012012362480167 },
];

// turf.circle option
const options = {
  steps: 64,
  units: "meters",
  options: {},
};

// circle radius
const radius = 30;

// array polygons
let polygons = [];

// set marker, add
centers.map(({ lat, lng }) => {
  const polygon = turf.circle([lng, lat], radius, options);

  // add cirkle polygon to map
  L.geoJSON(polygon, { color: "red", weight: 2 }).addTo(map);

  // add object to array
  polygons.push(polygon);
});

// get intersection
const intersection = turf.intersect(...polygons);

// style intersection
const intersectionColor = {
  color: "yellow",
  weight: 2,
  opacity: 1,
  fillColor: "yellow",
  fillOpacity: 0.7,
};

// adding an intersection to the map
// and styling to this element
L.geoJSON(intersection, { style: intersectionColor }).addTo(map);
