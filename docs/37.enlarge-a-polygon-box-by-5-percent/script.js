/* eslint-disable no-undef */
/**
 * Enlarge a polygon box by 5%
 */

// config map
let config = {
  minZoom: 1,
  maxZoom: 18,
};
// magnification with which the map will start
const zoom = 6;
// co-ordinates
const lat = 52.308478623663355;
const lng = 19.281005859375004;

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// country polygon
const poland = [
  [54.80068486732236, 18.292236328125004],
  [53.89786522246521, 14.611816406250002],
  [51.055207338584964, 15.281982421875002],
  [49.57510247172322, 19.138183593750004],
  [50.57626025689928, 23.642578125000004],
  [52.214338608258224, 23.148193359375004],
  [52.86912972768522, 23.741455078125],
  [54.29729354239267, 22.928466796875004],
  [54.29729354239267, 19.489746093750004],
  [54.80068486732236, 18.292236328125004],
];

// let's add a red polygon to the map
L.polygon(poland, {
  color: "red",
}).addTo(map);

// let's enlarge the polygon by 5%
const poly = turf.polygon([poland]);
const scaledPoly = turf.transformScale(poly, 1.05);

const { coordinates } = scaledPoly.geometry;

// we add the enlarged polygon to the map
L.polygon(coordinates, {
  color: "white",
}).addTo(map);
