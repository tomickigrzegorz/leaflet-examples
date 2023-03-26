/* eslint-disable no-undef */
/**
 * add data attribute to marker
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

// --------------------------------------------------------------
// create icon width data attribute

L.DataDivIcon = L.DivIcon.extend({
  createIcon: function (oldIcon) {
    let divElement = L.DivIcon.prototype.createIcon.call(this, oldIcon);

    if (this.options.data) {
      for (let key in this.options.data) {
        divElement.dataset[key] = this.options.data[key];
      }
    }
    return divElement;
  },
});

L.dataDivIcon = (options) => new L.DataDivIcon(options);

// --------------------------------------------------------------

const myNewIcon = L.dataDivIcon({
  className: "leaflet-data-marker",
  html: '<svg viewBox="0 0 149 178"><path fill="red" stroke="#FFF" stroke-width="10" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/></svg>',
  iconSize: [30, 20],
  data: {
    firstExample: "First example",
    secondExample: "Second example",
  },
});

// --------------------------------------------------------------
// add one marker

L.marker([52.22983, 21.011728], { icon: myNewIcon })
  .addTo(map)
  .bindPopup("Center Warsaw");
