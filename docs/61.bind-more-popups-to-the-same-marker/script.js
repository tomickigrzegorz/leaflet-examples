/* eslint-disable no-undef */
/**
 * bind more popups to the same marker
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

// ------------------------------

const markersData = [
  {
    name: "Location A",
    lat: 52.229823,
    lng: 21.011722,
    content: "content 1",
  },
  {
    name: "Location B",
    lat: 52.229639,
    lng: 21.010891,
    content: "content 2",
  },
  {
    name: "Location A",
    lat: 52.229823,
    lng: 21.011722,
    content: "content 3",
  },
];

// groupBy of markers with this same name
const groupedData = markersData.reduce((acc, value) => {
  if (!acc[value.name]) {
    acc[value.name] = [];
  }
  acc[value.name].push(value);
  return acc;
}, {});

// set marker on map
// add popup to marker
for (let key in groupedData) {
  const items = groupedData[key];

  // coordinates of first item, all items of
  // this group are supposed to be on same place
  const latLng = [items[0].lat, items[0].lng];

  // merge all popup contents
  const popupContent = items.map((item) => item.content).join("<hr/>");

  // add marker to popup
  L.marker(latLng).bindPopup(popupContent).addTo(map);
}
