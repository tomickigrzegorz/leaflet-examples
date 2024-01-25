/* eslint-disable no-undef */
/**
 * control layers outside the map
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

// async function to load geojson
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

// fetching data from geojson
const poiLayers = L.layerGroup().addTo(map);

// center map on the clicked marker
function clickZoom(e) {
  map.setView(e.target.getLatLng(), zoom);
}

let geojsonOpts = {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.divIcon({
        className: feature.properties.amenity,
        iconSize: L.point(16, 16),
        html: feature.properties.amenity[0].toUpperCase(),
        popupAnchor: [3, -5],
      }),
    })
      .bindPopup(
        feature.properties.amenity +
          "<br><b>" +
          feature.properties.name +
          "</b>"
      )
      .on("click", clickZoom);
  },
};

const layersContainer = document.querySelector(".layers");

const layersButton = "all layers";

function generateButton(name) {
  const id = name === layersButton ? "all-layers" : name;

  const templateLayer = `
    <li class="layer-element">
      <label for="${id}">
        <input type="checkbox" id="${id}" name="item" class="item" value="${name}" checked>
        <span>${name}</span>
      </label>
    </li>
  `;

  layersContainer.insertAdjacentHTML("beforeend", templateLayer);
}

generateButton(layersButton);

// add data to geoJSON layer and add to LayerGroup
const arrayLayers = ["bar", "pharmacy", "restaurant"];

arrayLayers.map((json) => {
  generateButton(json);
  fetchData(`./data/${json}.json`).then((data) => {
    window["layer_" + json] = L.geoJSON(data, geojsonOpts).addTo(map);
  });
});

document.addEventListener("click", (e) => {
  const target = e.target;

  const itemInput = target.closest(".item");

  if (!itemInput) return;

  showHideLayer(target);
});

function showHideLayer(target) {
  if (target.id === "all-layers") {
    arrayLayers.map((json) => {
      checkedType(json, target.checked);
    });
  } else {
    checkedType(target.id, target.checked);
  }

  const checkedBoxes = document.querySelectorAll("input[name=item]:checked");

  document.querySelector("#all-layers").checked =
    checkedBoxes.length - (document.querySelector("#all-layers").checked === true ? 1 : 0) < 3 ? false : true;
}

function checkedType(id, type) {
  map[type ? "addLayer" : "removeLayer"](window["layer_" + id]);

  map.fitBounds(window[["layer_" + id]].getBounds(), { padding: [50, 50] });

  document.querySelector(`#${id}`).checked = type;
}
