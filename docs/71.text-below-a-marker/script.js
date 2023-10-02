/* eslint-disable no-undef */
/**
 * Many markers
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

// ------------------------------------------------------------
// Example based on:
// https://stackoverflow.com/questions/59419337/how-to-add-text-below-a-marker-in-leaflet

// coordinate with popup text
let points = [
  [52.230020586193795, 21.01083755493164, "point 1 first example"],
  [52.22924516170657, 21.011320352554325, "point 2 second example"],
  [52.229511304688444, 21.01270973682404, "point 3 third example"],
];

// loop that adds many markers to the map
for (let i = 0; i < points.length; i++) {
  const [lat, lng, popupText] = points[i];

  // first example
  if (i == 0) {
    // add marker to map
    const marker1 = L.marker([lat, lng]).addTo(map);

    const test = L.marker([lat, lng], {
      icon: L.divIcon({
        className: "first-marker",
        html: popupText,
      }),
    }).addTo(map);

    const className = test.options.icon.options.className;
    const getLabel = document.querySelector(`.${className}`);
    const width = getLabel.offsetWidth;
    getLabel.style.cssText += `--width-text: ${width / 2}px;`;
  }

  // second example
  if (i == 1) {
    const marker2 = L.marker([lat, lng]).addTo(map);
    marker2.bindTooltip(popupText, {
      permanent: true,
      direction: "bottom",
      className: "second-marker",
      offset: [-15, 30],
    });
  }

  // third example
  if (i == 2) {
    const marker3 = L.marker([lat, lng]).addTo(map);
    createLabel(marker3, popupText);
  }
}

/**
 * Remove layer from map
 *
 * @param {object} layer
 */
function removeLabel(layer) {
  if (layer.appendedLabel) {
    map.removeLayer(layer.appendedLabel);
  }
}

/**
 * Create label
 *
 * @param {object} layer
 * @param {string} text
 */
function createLabel(layer, text) {
  // remove label if exists
  removeLabel(layer);

  // create label
  const icon = createStaticLabelIcon(text);
  const testspan = document.createElement("span");

  // add testspan to body to get width
  document.body.appendChild(testspan);

  // add marker to map
  const label = L.marker(layer.getLatLng(), { icon }).addTo(map);

  // get width of label
  const getLabel = document.querySelector(`.${icon.options.className}`);
  const width = getLabel.offsetWidth;
  // set new iconAnchor
  icon.options.iconAnchor = [width / 2, -4];

  // set label to layer with new iconAnchor
  label.setIcon(icon);

  // remove testspan
  document.body.removeChild(testspan);
}

/**
 * Create static label icon
 *
 * @param {string} labelText
 * @returns {object}
 */

function createStaticLabelIcon(labelText) {
  return L.divIcon({
    className: "leaflet-marker-label",
    html: `<span class="leaflet-marker-iconlabel">${labelText}</span>`,
    text: labelText,
  });
}
