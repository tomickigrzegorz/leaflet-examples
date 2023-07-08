/* eslint-disable no-undef */
/**
 * popup in a fixed position
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

const marker = L.marker([52.22983, 21.011728])
  .addTo(map)
  .bindPopup("Center Warsaw");

// --------------------------------------------

let root = document.documentElement;

marker.on("click", function (e) {
  const target = e.target;

  // get icon
  const icon = target._icon;
  // get shadow
  const shadow = target._shadow;
  // get popup
  const popup = target._popup._container;

  // add class to marker, shadow and popup
  icon.classList.add("marker-icon-jump");
  shadow.classList.add("marker-shadow-jump");
  popup.classList.add("popup-element-jump");

  // get icon naturalHeight
  const markerHeight = target._icon.naturalHeight;
  // get layer points, the coordinates are used in translate3d
  const { x, y } = e.layerPoint;

  // we add the data to the root html element
  // x,y of the maker and its height
  // these styles are used to calculate new marker
  // coordinates - our animation
  // see style.css from this example
  addRemoveRootStyleProperty("add", x, y, markerHeight);
});

map.on("click", (e) => {
  map.eachLayer(function (layer) {
    if (layer instanceof L.Marker) {
      layer._shadow.classList.remove("marker-shadow-jump");
      layer._icon.classList.remove("marker-icon-jump");
      addRemoveRootStyleProperty();
    }
  });
});

/**
 * Add/remove style property to the root element (html)
 *
 * @param {String} type
 * @param {Number} x
 * @param {Number} y
 * @param {Number} markerHeight
 */
function addRemoveRootStyleProperty(type, x, y, markerHeight) {
  const posX = "--position-x";
  const posY = "--position-y";
  const mHeight = "--marker-height";

  if (type === "add") {
    // add style to html - root element
    root.style.setProperty(posX, x + "px");
    root.style.setProperty(posY, y + "px");
    root.style.setProperty(mHeight, markerHeight + "px");
  } else {
    // remove all style
    root.style.removeProperty(posX);
    root.style.removeProperty(posY);
    root.style.removeProperty(mHeight);
  }
}
