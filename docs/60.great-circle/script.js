/* eslint-disable no-undef */
/**
 * great-circle
 */

// config map
let config = {
  minZoom: 2,
  maxZomm: 18,
};
// magnification with which the map will start
const zoom = 10;
// co-ordinates
const lat = 51.918904;
const lng = 19.1343786;

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

map.on("click", (e) => {
  console.log(e.latlng);
});

// ------------------------------

const cityCoords = [
  [41.902783, 12.496366], // rome
  [64.12738671814198, -21.895751953125], // reykjavik
  [48.38544219115486, -4.482421875000001], // breat
];

const icon = L.icon({
  iconUrl: "http://grzegorztomicki.pl/serwisy/pin.png",
  iconSize: [50, 58], // size of the icon
  iconAnchor: [20, 58], // changed marker icon position
  popupAnchor: [0, -60], // changed popup position
});

// center of the map
const center = [21.134393, 52.282426];

// start point
const start = turf.point(center);

L.marker([52.282426, 21.134393], { icon: icon })
  .bindPopup(`mazowieckie<br>${center.toString()}`)
  .addTo(map);

let featureGroups = [];

cityCoords.map((city) => {
  // all markers to map
  const marker = L.marker(city).bindPopup(city.toString()).addTo(map);

  // add marker to array
  featureGroups.push(marker);

  // end point
  const end = turf.point(city.reverse());

  // distance between two points
  const greatCircle = turf.greatCircle(start, end);

  // set geoJSON to map
  L.geoJSON(greatCircle).addTo(map);
});

// ------------------------------
// add array to featureGroup
let group = new L.featureGroup(featureGroups);

// set map view to featureGroup
map.fitBounds(group.getBounds(), {
  padding: [50, 50], // adding padding to map
});
