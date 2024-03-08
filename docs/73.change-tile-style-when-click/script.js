/* eslint-disable no-undef */
/**
 * change tile style when click
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

// ------------------------------------------------------
// click on map

map.on("click", (e) => {
  const { lat, lng } = e.latlng;

  // find image with specific src
  let img = document.querySelector(
    `img[src="https://tile.openstreetmap.org/${getTileNumber(lat, lng)}.png"]`,
  );

  // add/remove class active-tiles
  img = img.classList.contains("active-tiles")
    ? img.classList.remove("active-tiles")
    : img.classList.add("active-tiles");
});

// convert lat, lng to tile number
function getTileNumber(lat, lng) {
  const currentZoom = map.getZoom();

  const xtile = parseInt(Math.floor(((lng + 180) / 360) * (1 << currentZoom)));
  const ytile = parseInt(
    Math.floor(
      ((1 -
        Math.log(
          Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180),
        ) /
          Math.PI) /
        2) *
        (1 << currentZoom),
    ),
  );
  return `${currentZoom}/${xtile}/${ytile}`;
}
