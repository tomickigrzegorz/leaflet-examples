/* eslint-disable no-undef */
/**
 * https://github.com/lvoogdt/Leaflet.awesome-markers
 */

// config map
let config = {
  minZoom: 7,
  maxZoom: 18,
};
// magnification with which the map will start
const zoom = 17;
// co-ordinates
const lat = 52.22977;
const lng = 21.01178;

// coordinate array with popup text
let points = [
  {
    lat: 52.230020586193795,
    lng: 21.01083755493164,
    text: "point 1",
    flag: 1,
  },
  {
    lat: 52.22924516170657,
    lng: 21.011320352554325,
    text: "point 2",
    flag: 0,
  },
  {
    lat: 52.229511304688444,
    lng: 21.01270973682404,
    text: "point 3",
    flag: 2,
  },
  {
    lat: 52.23040500771883,
    lng: 21.012146472930908,
    text: "point 4",
    flag: 3,
  },
];

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Creates a red marker with the coffee icon
function colors(flag) {
  let colorMarker = "";
  switch (flag) {
    case 0:
      colorMarker = "pink";
      break;
    case 1:
      colorMarker = "red";
      break;
    case 2:
      colorMarker = "blue";
      break;
    case 3:
      colorMarker = "green";
      break;
    default:
      break;
  }

  return L.AwesomeMarkers.icon({
    markerColor: colorMarker,
  });
}

// loop that adds many markers to the map
for (let i = 0; i < points.length; i++) {
  const { lat, lng, text, flag } = points[i];

  new L.marker([lat, lng], {
    icon: colors(flag),
  })
    .bindPopup(text)
    .addTo(map);
}
