/* eslint-disable no-undef */
/**
 * add rectangle over click tiles
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

// ----------------------------------------------
// convert lat lng and zoom on rectangle when click on map

map.on("click", (e) => {
  const { lat, lng } = e.latlng;
  const zoom = map.getZoom();

  const { x, y } = getTileNumber(lat, lng, zoom);

  const rectangle = L.rectangle(
    [
      [tile2lat(y, zoom), tile2lon(x, zoom)],
      [tile2lat(parseInt(y) + 1, zoom), tile2lon(parseInt(x) + 1, zoom)],
    ],
    {
      color: "#ff7800",
      weight: 1,
    }
  ).addTo(map);
});

// convert lat lng to tile lon
function tile2lon(x, z) {
  return (x / Math.pow(2, z)) * 360 - 180;
}

// convert lat lng to tile lat
function tile2lat(y, z) {
  const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z);
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}

// generate tile lat, lng
function getTileNumber(lat, lng, zoom) {
  const xtile = parseInt(Math.floor(((lng + 180) / 360) * (1 << zoom)));
  const ytile = parseInt(
    Math.floor(
      ((1 -
        Math.log(
          Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
        ) /
          Math.PI) /
        2) *
        (1 << zoom)
    )
  );
  return { x: xtile, y: ytile };
}
