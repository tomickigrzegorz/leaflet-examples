/* eslint-disable no-undef */
/**
 * Marker slide to
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

// add one marker
const marker = L.marker([52.22983, 21.011728]).addTo(map);

// marker position on the map
const markerPosition = [
  {
    lat: 52.229721589372964,
    lng: 21.011298894882206,
  },
  {
    lat: 52.22954744743949,
    lng: 21.01188898086548,
  },
  {
    lat: 52.22970516091786,
    lng: 21.012243032455448,
  },
  {
    lat: 52.22997787248553,
    lng: 21.011261343955997,
  },
  {
    lat: 52.22993187306146,
    lng: 21.01217329502106,
  },
];

// change position of marker
markerPosition.forEach(({ lat, lng }, index) => {
  setTimeout(() => {
    marker.slideTo([lat, lng], { duration: 1000 });
  }, index * 2000);
});
