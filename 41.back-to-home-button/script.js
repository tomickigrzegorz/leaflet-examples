/* eslint-disable no-undef */
/**
 * Back to home button
 */

// config map
let config = {
  minZoom: 7,
  maxZomm: 18,
};
// magnification with which the map will start
const zoom = 18;
// co-ordinates
const lat = 52.22977;
const lng = 21.01178;

// calling map
const map = L.map('map', config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);



const button = document.querySelector('.back-to-home');

// on drag end
map.on('dragend', getCenterOfMap);

// on zoom end
map.on('zoomend', getCenterOfMap);


function getCenterOfMap() {
  const { lat, lng } = map.getCenter();
  const latDZ = lat.toFixed(5) * 1;
  const lngDZ = lng.toFixed(5) * 1;

  arrayCheckAndClick([latDZ, lngDZ]);
}

// compare two arrays, if arrays diffrent show button home-back
function arrayCheckAndClick(array) {
  if ([lat, lng].sort().join(',') !== array.sort().join(',')) {
    button.style.display = 'block';
  } else {
    button.style.display = 'none';
  }

  // clicking on home-back set default view and zoom
  button.addEventListener('click', function () {
    map.setView([lat, lng], zoom);
    button.style.display = 'none';
  });
}