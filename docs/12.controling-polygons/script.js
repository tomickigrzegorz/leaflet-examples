/* eslint-disable no-undef */
/**
 * Controling polygons
 */

// config map
let config = {
  minZoom: 7,
  maxZoom: 18,
};
// magnification with which the map will start
const zoom = 13;
// co-ordinates
const lat = 52.232005085482115;
const lng = 21.006889343261722;

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

//
const River = L.polygon([
  [52.261433597272294, 21.01272583007813],
  [52.259857564663236, 21.008262634277347],
  [52.2485084763669, 21.019763946533207],
  [52.24377883252849, 21.026287078857425],
  [52.240835688576325, 21.032123565673828],
  [52.235474460511696, 21.037960052490238],
  [52.22800971166361, 21.04465484619141],
  [52.2249603686772, 21.047916412353516],
  [52.23600009974023, 21.042766571044925],
  [52.24966453484508, 21.023368835449222],
  [52.26132853017426, 21.01272583007813],
]);

const Place = L.polygon(
  [
    [52.23295130556395, 20.998821258544925],
    [52.230007443518716, 20.98474502563477],
    [52.224750061441355, 20.98920822143555],
    [52.22769427210073, 21.002597808837894],
  ],
  {
    color: "red",
    className: "place",
  }
);

// Extended `LayerGroup` that makes it easy
// to do the same for all layers of its members
const river = new L.FeatureGroup();
const place = new L.FeatureGroup();

// adding polugons to the map
river.addLayer(River);
place.addLayer(Place);

// object with layers
const overlayMaps = {
  River: river,
  Place: place,
};

// centering a group of markers
map.on("layeradd", function () {
  // Create new empty bounds
  let bounds = new L.LatLngBounds();
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
    this._removePolygons();
    this._update();
    return this._container;
  },
  _removePolygons: function () {
    this.createButton("remove", "Remove all polygons");
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
    button.textContent = className;

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
