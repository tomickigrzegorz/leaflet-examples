/* eslint-disable no-undef */
/**
 * Custom marker and popup
 */

// config map
let config = {
  minZoom: 7,
  maxZoom: 18,
};
// magnification with which the map will start
const zoom = 18;
// co-ordinates
const lat = 50.0619474;
const lng = 19.9368564;

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const funny = L.icon({
  iconUrl: "http://grzegorztomicki.pl/serwisy/pin.png",
  iconSize: [50, 58], // size of the icon
  iconAnchor: [20, 58], // changed marker icon position
  popupAnchor: [0, -60], // changed popup position
});

// create popup contents
const customPopup =
  '<iframe width="360" height="310" src="https://www.youtube.com/embed/glKDhBuoRUs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';

// specify popup options
const customOptions = {
  maxWidth: "auto", // set max-width
  className: "customPopup", // name custom popup
};

// create marker object, pass custom icon as option, pass content and options to popup, add to map
L.marker([lat, lng], {
  icon: funny,
})
  .bindPopup(customPopup, customOptions)
  .addTo(map);

// styles are in style.css
// .customPopup .leaflet-popup-content-wrapper,
// .customPopup .leaflet-popup-tip {
//   background: #000;
//   color: #fff;
// }
