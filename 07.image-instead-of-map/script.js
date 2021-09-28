/* eslint-disable no-undef */
/**
 * Image instead of map
 */

let bounds = [
  [50, 50], // padding
  [847, 1280], // image dimensions
];

// L.CRS.Simple
//  A simple CRS that maps longitude and latitude into `x` and `y` directly.
// May be used for maps of flat surfaces (e.g. game maps).
let map = L.map("map", {
  crs: L.CRS.Simple,
  maxZoom: 1,
  minZoom: -4,
  maxBounds: bounds,
});

// Used to load and display a single image over
// specific bounds of the map. Extends `Layer`.
L.imageOverlay("../static/factory_UML.png", bounds).addTo(map);

// method fitBounds sets a map view
// that contains the given geographical bounds with the
// maximum zoom level possible.
map.fitBounds(bounds);
