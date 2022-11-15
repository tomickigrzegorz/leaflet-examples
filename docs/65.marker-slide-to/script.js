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
    color: "red",
  },
  {
    lat: 52.22954744743949,
    lng: 21.01188898086548,
    color: "blue",
  },
  {
    lat: 52.22970516091786,
    lng: 21.012243032455448,
    color: "green",
  },
  {
    lat: 52.22997787248553,
    lng: 21.011261343955997,
    color: "black",
  },
  {
    lat: 52.22993187306146,
    lng: 21.01217329502106,
    color: "orange",
  },
];

// change position of marker
markerPosition.forEach(({ lat, lng, color }, index) => {
  setTimeout(() => {
    marker.slideTo([lat, lng], { duration: 1000 });

    let markerBefore =
      index === 0
        ? [52.22983, 21.011728]
        : [markerPosition[index - 1].lat, markerPosition[index - 1].lng];

    console.log(markerBefore);

    L.polyline([markerBefore, [lat, lng]], {
      color,
      weight: 5,
      dashArray: 10,
    }).addTo(map);
  }, index * 1000);
});
