/**
 * XXXXXXXXXXXX
 */

// config map
let config = {
  minZoom: 7,
  maxZomm: 18,
};
// magnification with which the map will start
const zoom = 13;
// co-ordinates
const lat = 52.232005085482115;
const lon = 21.006889343261722;

// calling map
const map = L.map('map', config).setView([lat, lon], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
  [52.26132853017426, 21.01272583007813]
])

const Place = L.polygon([
  [52.23295130556395, 20.998821258544925],
  [52.230007443518716, 20.98474502563477],
  [52.224750061441355, 20.98920822143555],
  [52.22769427210073, 21.002597808837894]
], {
  color: 'red',
  className: 'place'
});

// Extended `LayerGroup` that makes it easy
// to do the same for all layers of its members
const river = new L.LayerGroup();
const place = new L.LayerGroup();
const allPolygons = new L.LayerGroup();

// adding polugons to the map
river.addLayer(River);
place.addLayer(Place);

// object with layers
const overlayMaps = {
  'River': river,
  'Place': place,
  'Remove all polygons': allPolygons
};

// The layers control gives users the ability to switch
// between different base layers and switch overlays on/off
L.control.layers(null, overlayMaps, {
  collapsed: false
}).addTo(map);

// centering a group of polygon 
map.on('overlayadd', function (e) {
  const lastCheckboxs = document.querySelectorAll('.leaflet-control-layers-selector');
  e.layer.eachLayer(function (pol) {
    console.log(pol)
    map.fitBounds(pol.getBounds());
    lastCheckboxs[lastCheckboxs.length - 1].checked = false;
  });

});

// Remove all layer from map when click
// on 'Remove all polygons' checkbox
overlayMaps['Remove all polygons'].on('add', function (e) {
  const allOverlay = Object.keys(overlayMaps).reduce((obj, key) => {
    if (key !== 'Remove all polygons') {
      obj[key] = overlayMaps[key]
    }
    return obj
  }, {});

  setTimeout(function () {
    for (let overlay in allOverlay) {
      map.removeLayer(overlayMaps[overlay]);
    }
  }, 0);
});