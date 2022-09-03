/* eslint-disable no-undef */
/**
 * linked view
 */

// config map
let config = {
  minZoom: 2,
  maxZoom: 18,
};
// magnification with which the map will start
const zoom = 6;
// co-ordinates
const lat = 51.918904;
const lng = 19.1343786;

// calling map
const map = L.map("map-linked", config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// adding geojson by fetch
// of course you can use jquery, axios etc.

let html = "";
// GeoJSON layer
let geoJson;

fetch("../static/wojewodztwa-medium.geojson")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    // Load GeoJSON on map & construct list HTML code
    console.log(data);

    const dataSort = data.features.sort((a, b) =>
      a.properties.nazwa.localeCompare(b.properties.nazwa)
    );

    geoJson = L.geoJSON(dataSort, { style: normalStyle, onEachFeature }).addTo(
      map
    );

    // Intert list HTML
    document.getElementById("voivodeship").innerHTML = html;

    // Bind event listeners to list items
    let el = document.querySelectorAll("#voivodeship li");
    for (let i = 0; i < el.length; i++) {
      el[i].addEventListener("mouseover", function (e) {
        const hoveredItem = e.target;
        const layer = geoJson.getLayers();

        layer[i].setStyle(highlightStyle);

        hoveredItem.classList.add("highlight");
      });
      el[i].addEventListener("mouseout", function (e) {
        const hoveredItem = e.target;
        const hoveredId = hoveredItem.id;

        geoJson.resetStyle(geoJson.getLayer(hoveredId));
        hoveredItem.classList.remove("highlight");
      });
    }
  });

const highlightStyle = {
  weight: 4,
  fillOpacity: 0.7,
};

const normalStyle = {
  fillColor: "#ffeb3b",
  weight: 1,
  opacity: 1,
  color: "#e91e63",
  fillOpacity: 0.15,
};

// Function applied on each polygon load
function onEachFeature(feature, layer) {
  const { id, nazwa } = feature.properties;
  // console.log(id, nazwa)
  html += `<li id="${id}">${nazwa}</li>`;
  layer.leafletId = id;

  layer.addEventListener("mouseover", function (e) {
    let hoveredFeature = e.target;

    hoveredFeature.setStyle(highlightStyle);
    hoveredFeature.bringToFront();

    // console.log(layer.leafletId);
    let el = document.getElementById(hoveredFeature.leafletId);

    el.scrollIntoView({
      behavior: "auto",
      block: "center",
      inline: "center",
    });
    el.classList.add("highlight");
  });
  layer.addEventListener("mouseout", function (e) {
    let hoveredFeature = e.target;

    geoJson.resetStyle(hoveredFeature);

    let el = document.getElementById(hoveredFeature.leafletId);
    el.classList.remove("highlight");
  });
}
