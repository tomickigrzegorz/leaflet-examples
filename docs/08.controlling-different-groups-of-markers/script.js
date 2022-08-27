/* eslint-disable no-undef */
/**
 * Multiple layers of markers
 * Adding the ability to show several layers of
 * markers, as well as the ability to remove all layers.
 * Centering on a specific layer.
 */

// config map
let config = {
  minZoom: 7,
  maxZoom: 18,
};
// magnification with which the map will start
const zoom = 18;
// coordinates
const lat = 52.22977;
const lng = 21.01178;

// coordinate array with popup text
const pointsA = [
  [52.230020586193795, 21.01083755493164, "point A1"],
  [52.22924516170657, 21.011320352554325, "point A2"],
  [52.229511304688444, 21.01270973682404, "point A3"],
  [52.23040500771883, 21.012146472930908, "point A4"],
];

const pointsB = [
  [52.229314161892106, 21.012055277824405, "point B1"],
  [52.22950144756943, 21.01193726062775, "point B2"],
  [52.22966573260081, 21.011829972267154, "point B3"],
  [52.2298333027065, 21.011744141578678, "point B4"],
  [52.2299680154701, 21.01164758205414, "point B5"],
  [52.23012572745442, 21.011583209037784, "point B6"],
  [52.230276867580336, 21.01143836975098, "point B7"],
  [52.23046414919644, 21.011341810226444, "point B8"],
];

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Extended `LayerGroup` that makes it easy
// to do the same for all layers of its members
const pA = new L.FeatureGroup();
const pB = new L.FeatureGroup();
const allMarkers = new L.FeatureGroup();

// adding markers to the layer pointsA
for (let i = 0; i < pointsA.length; i++) {
  marker = L.marker([pointsA[i][0], pointsA[i][1]]).bindPopup(pointsA[i][2]);
  pA.addLayer(marker);
}

// adding markers to the layer pointsB
for (let i = 0; i < pointsB.length; i++) {
  marker = L.marker([pointsB[i][0], pointsB[i][1]]).bindPopup(pointsB[i][2]);
  pB.addLayer(marker);
}

// object with layers
const overlayMaps = {
  "point A": pA,
  "point B": pB,
};

// centering a group of markers
map.on("layeradd layerremove", function () {
  // Create new empty bounds
  let bounds = new L.LatLngBounds();
  // Iterate the map's layers
  map.eachLayer(function (layer) {
    // Check if layer is a featuregroup
    if (layer instanceof L.FeatureGroup) {
      // Extend bounds with group's bounds
      bounds.extend(layer.getBounds());
    }
  });

  // Check if bounds are valid (could be empty)
  if (bounds.isValid()) {
    // Valid, fit bounds
    map.flyToBounds(bounds);
  } else {
    // Invalid, fit world
    // map.fitWorld();
  }
});

L.Control.CustomButtons = L.Control.Layers.extend({
  onAdd: function () {
    this._initLayout();
    this._addMarker();
    this._removeMarker();
    this._update();
    return this._container;
  },
  _addMarker: function () {
    this.createButton("add", "add-button");
  },
  _removeMarker: function () {
    this.createButton("remove", "remove-button");
  },
  createButton: function (type, className) {
    const elements = this._container.getElementsByClassName(
      "leaflet-control-layers-list"
    );
    const button = L.DomUtil.create(
      "button",
      `btn-markers ${className}`,
      elements[0]
    );
    button.textContent = `${type} markers`;

    L.DomEvent.on(button, "click", function (e) {
      const checkbox = document.querySelectorAll(
        ".leaflet-control-layers-overlays input[type=checkbox]"
      );

      // Remove/add all layer from map when click on button
      [].slice.call(checkbox).map((el) => {
        el.checked = type === "add" ? false : true;
        el.click();
      });
    });
  },
});

new L.Control.CustomButtons(null, overlayMaps, { collapsed: false }).addTo(map);
