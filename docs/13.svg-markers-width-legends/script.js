/* eslint-disable no-undef */
/**
 * svg markers width legends
 */

// config map
let config = {
  minZoom: 7,
  maxZoom: 18,
};
// magnification with which the map will start
const zoom = 13;
// co-ordinates
const lat = 52.237049;
const lng = 21.017532;

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// LEGENDS

// the control element is placed in the bottom right corner
const legend = L.control({
  position: "bottomright",
});

// we create a div with a legend class
const div = L.DomUtil.create("div", "legend");
// color table
const color = ["#fe4848", "#fe6c58", "#fe9068", "#feb478", "#fed686"];
// table of texts that will appear in the popup and legend
const label = ["2-12.5", "12.6-16.8", "16.9-20.9", "21-25.9", "26-plus"];

// we add records to the L.control method
const rows = [];
legend.onAdd = function () {
  color.map((item, index) => {
    rows.push(`
        <div class="row">
          <i style="background: ${item}"></i>${label[index]}
        </div>  
    `);
  });
  div.innerHTML = rows.join("");
  return div;
};

// we are adding a legend to the map
legend.addTo(map);

// MARKERS
const markers = [
  [52.228956, 21.003799],
  [52.258071, 20.986805],
  [52.242728, 21.041565],
  [52.234213, 21.029034],
  [52.251661, 21.003456],
];

// the function creates colorful svg
function colorMarker(color) {
  const svgTemplate = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="marker">
      <path fill-opacity=".25" d="M16 32s1.427-9.585 3.761-12.025c4.595-4.805 8.685-.99 8.685-.99s4.044 3.964-.526 8.743C25.514 30.245 16 32 16 32z"/>
      <path stroke="#fff" fill="${color}" d="M15.938 32S6 17.938 6 11.938C6 .125 15.938 0 15.938 0S26 .125 26 11.875C26 18.062 15.938 32 15.938 32zM16 6a4 4 0 100 8 4 4 0 000-8z"/>
    </svg>`;

  const icon = L.divIcon({
    className: "marker",
    html: svgTemplate,
    iconSize: [40, 40],
    iconAnchor: [12, 24],
    popupAnchor: [7, -16],
  });

  return icon;
}

// let's add markers to the map
markers.map((marker, index) => {
  const lat = marker[0];
  const lng = marker[1];
  L.marker([lat, lng], {
    icon: colorMarker(color[index]),
  })
    .bindPopup(`color: #${color[index]}<br>${label[index]}`)
    .addTo(map);
});
