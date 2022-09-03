/* eslint-disable no-undef */
/**
 * image on map
 */

// config map
let config = {
  minZoom: 1,
  maxZoom: 18,
};
// magnification with which the map will start
const zoom = 15;
// co-ordinates
const lat = 50.0595;
const lng = 19.9379;

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// image
const imageUrl =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Krakow_Center_-_basic_map.svg/1440px-Krakow_Center_-_basic_map.svg.png";

// new icon
const funny = L.icon({
  iconUrl: "http://grzegorztomicki.pl/serwisy/pin.png",
  iconSize: [50, 58], // size of the icon
  iconAnchor: [20, 58], // changed marker icon position
  popupAnchor: [0, -60], // changed popup position
});

// custom popup image + text
const customPopup =
  '<div class="customPopup"><figure><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/A-10_Sukiennice_w_Krakowie_Krak%C3%B3w%2C_Rynek_G%C5%82%C3%B3wny_MM.jpg/1920px-A-10_Sukiennice_w_Krakowie_Krak%C3%B3w%2C_Rynek_G%C5%82%C3%B3wny_MM.jpg"><figcaption>Source: wikipedia.org</figcaption></figure><div>Kraków,[a] also written in English as Krakow and traditionally known as Cracow, is the second-largest and one of the oldest cities in Poland. Situated on the Vistula River in Lesser Poland Voivodeship... <a href="https://en.wikipedia.org/wiki/Krak%C3%B3w" target="_blank">→ show more</a></div></div>';

// specify popup options
const customOptions = {
  minWidth: "220", // set max-width
  keepInView: true, // Set it to true if you want to prevent users from panning the popup off of the screen while it is open.
};

// create marker object, pass custom icon as option, pass content and options to popup, add to map
L.marker([50.0616, 19.9373], {
  icon: funny,
})
  .bindPopup(customPopup, customOptions)
  .on("click", clickZoom)
  .addTo(map);

// center map when click on marker
function clickZoom(e) {
  map.setView(e.target.getLatLng(), zoom);
}

// add image to map ;)
const imageBounds = [
  [50.0665, 19.93],
  [50.0522, 19.9455],
];

L.imageOverlay(imageUrl, imageBounds, { opacity: 1 }).addTo(map);
