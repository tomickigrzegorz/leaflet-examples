/* eslint-disable no-undef */
/**
 * multiple tile layers
 */

// magnification with which the map will start
const zoom = 18;
// co-ordinates
const lat = 52.22977;
const lng = 21.01178;

const osmLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
const cartoDB = '<a href="http://cartodb.com/attributions">CartoDB</a>';

const osmUrl = "http://tile.openstreetmap.org/{z}/{x}/{y}.png";
const osmAttrib = `&copy; ${osmLink} Contributors`;
const landUrl =
  "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png";
const cartoAttrib = `&copy; ${osmLink} Contributors & ${cartoDB}`;

const osmMap = L.tileLayer(osmUrl, { attribution: osmAttrib });
const landMap = L.tileLayer(landUrl, { attribution: cartoAttrib });

// config map
let config = {
  layers: [osmMap],
  minZoom: 7,
  maxZoom: 18,
};

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

var baseLayers = {
  "OSM Mapnik": osmMap,
  CartoDB: landMap,
};

L.control.layers(baseLayers).addTo(map);
