/* eslint-disable no-undef */
/**
 * leaflet-geoman
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

L.control.zoom({ position: "topright" }).addTo(map);

const options = {
  position: "topleft", // toolbar position, options are 'topleft', 'topright', 'bottomleft', 'bottomright'
  drawMarker: true, // adds button to draw markers
  drawPolygon: true, // adds button to draw a polygon
  drawPolyline: true, // adds button to draw a polyline
  drawCircle: true, // adds button to draw a cricle
  editPolygon: true, // adds button to toggle global edit mode
  deleteLayer: true, // adds a button to delete layers
};

// add leaflet.pm controls to the map
map.pm.addControls(options);

// get array of all available shapes
map.pm.Draw.getShapes();

// disable drawing mode
map.pm.disableDraw("Polygon");

// listen to when drawing mode gets enabled
map.on("pm:drawstart", function (e) {
  console.log(e);
});

// listen to when drawing mode gets disabled
map.on("pm:drawend", function (e) {
  console.log(e);
});

// listen to when a new layer is created
map.on("pm:create", function (e) {
  console.log(e.layer.getLatLngs());

  // listen to changes on the new layer
  e.layer.on("pm:edit", function (x) {
    console.log("edit", x);
  });
});
