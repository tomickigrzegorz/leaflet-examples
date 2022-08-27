/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/**
 * MiniMap
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

const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const osmURL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const orm = L.tileLayer(osmURL, { attribution }).addTo(map);

//Plugin magic goes here! Note that you cannot use the same layer object again, as that will confuse the two map controls

const osm2 = new L.TileLayer(osmURL, { minZoom: 0, maxZoom: 13, attribution });
const miniMap = new L.Control.MiniMap(osm2, { toggleDisplay: true }).addTo(map);
