/* eslint-disable no-undef */
/**
 * TileLayer
 */

// config map
let config = {
  crs: L.CRS.Simple,
  center: [0, 0],
  zoom: 5,
};

// calling map
const map = L.map("map", config);

// Used to load and display tile layers on the map
L.TileLayer.Loremflickr = L.TileLayer.extend({
  getTileUrl: function (coords) {
    var i = Math.ceil(Math.random() * 40);
    return "https://loremflickr.com/250/250?lock=" + i;
  },
  getAttribution: function () {
    return "<a target='_blank' href='https://babakfakhamzadeh.com/project/loremflickr-com/'>loremflickr</a>";
  },
});

L.tileLayer.loremflickr = function () {
  return new L.TileLayer.Loremflickr();
};
// add to map
L.tileLayer.loremflickr().addTo(map);
