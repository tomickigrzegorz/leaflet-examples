/* eslint-disable no-undef */
/**
 * create additional control placeholders
 */

// config map
const config = {
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

// --------------------------------------------------------------
// Create additional Control placeholders
// stackoverflow.com/a/33621034/10424385

(function addControlPlaceholders(map) {
  const corners = map._controlCorners;
  const l = "leaflet-";
  const container = map._controlContainer;

  function createCorner(vSide, hSide) {
    const className = `${l + vSide} ${l}${hSide}`;
    corners[vSide + hSide] = L.DomUtil.create("div", className, container);
  }

  createCorner("top", "center");
  createCorner("bottom", "center");
  createCorner("vertical", "left");
  createCorner("vertical", "right");
})(map);

// --------------------------------------------------------------
const configs = [
  { position: "topcenter", description: "top description" },
  { position: "bottomcenter", description: "bottom description" },
  { position: "verticalleft", description: "left description" },
  { position: "verticalright", description: "right description" },
];

configs.forEach((item) => {
  L.Control.Search = L.Control.extend({
    options: {
      position: item.position,
    },
    onAdd: () => {
      const container = L.DomUtil.create("div", "description");

      L.DomEvent.disableClickPropagation(container);

      container.insertAdjacentHTML("beforeend", item.description);

      return container;
    },
  });

  new L.Control.Search().addTo(map);
});
