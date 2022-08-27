/* eslint-disable no-undef */
/**
 * store plane - full project
 */

// config map
let config = {
  minZoom: 17,
  maxZoom: 19,
  zoomSnap: 0,
  zoomDelta: 1,
};
// magnification with which the map will start
const zoom = 18;
// co-ordinates
const lat = 51.14465;
const lng = 23.4444;

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
let osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
});

let drawnItems = L.featureGroup().addTo(map);

osm.addTo(map);

// --------------------------------------------------
// add svg imageOverlay
const imageUrl = "light-chelm-galeria.svg";

// add image to map ;)
const imageBounds = [
  [51.14725, 23.4427],
  [51.142, 23.445995],
];

L.imageOverlay(imageUrl, imageBounds).addTo(map);

// --------------------------------------------------

function styles(feature, layer) {
  return {
    fillColor: feature.properties?.style?.fill,
    weight: feature.properties?.style?.weight,
    color: feature.properties?.style?.color,
    fillOpacity: feature.properties?.style?.fillOpacity,
  };
}

function style(feature) {
  return {
    fillColor: "#ededed",
    weight: 2,
    opacity: 1,
    color: "white",
    fillOpacity: 0.7,
  };
}

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 2,
    color: "black",
    dashArray: 6,
  });
}

let geojson;

function resetHighlight(e) {
  geojson.resetStyle(e.target);
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature,
  });
}

// adding geojson by fetch
// of course you can use jquery, axios etc.
fetch("data.geojson")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    geojson = L.geoJSON(data, {
      style: styles,
      onEachFeature,
    }).addTo(map);
  });

// --------------------------------------------------

const shopsList = document.querySelector(".shops-list");

fetch("data.geojson")
  .then((response) => response.json())
  .then((data) => {
    return data.features
      .sort(
        (a, b) =>
          a.properties.category.localeCompare(b.properties.category) ||
          a.properties.info.name.localeCompare(b.properties.info.name)
      )
      .map((item, index, array) => {
        // console.log(el, index, array);
        const category =
          item.properties.category !== array[index - 1]?.properties.category
            ? `<li><h3 class="shop-category">${item.properties.category}</h3></li>`
            : "";

        const template = `
          ${category}
          <li class="shop-item" data-shop-id="${item.properties.id}">
            <div class="name">${item.properties.info.name}</div>
            <div class="shop-color" style="background: ${item.properties.color}"></div>
          </li>
        `;

        return shopsList.insertAdjacentHTML("beforeend", template);
      });
  })
  .then(() => {
    clickOnItem();
  });

function zoomToFeature(e, type) {
  const layer = e.target || e;
  const bounds = layer.getBounds();

  map.flyToBounds(bounds, { padding: [50, 50] });

  document.getElementById("search-shop").value = "";

  removeActiveItem();

  setActiveMenuItem(layer.feature.properties.id, type);

  const { name, logo, button, description } = layer.feature.properties.info;

  const logoImg = logo
    ? `<div class="info-logo"><img src="${logo}"></div>`
    : "";

  const descriptionText = description
    ? `<div class="info-description">${description}</div>`
    : "";

  const infoButton = button
    ? `<div class="info-button"><button>${button}</button></div>`
    : "";

  const template = `
    <div class="info-shop">
      ${logoImg}
      <div>
        <h1 class="info-name">${name}</h1>
        ${descriptionText}
        ${infoButton}
      </div>
    </div>`;

  layer.bindPopup(template).openPopup();
}

// --------------------------------------------------

function clickOnItem() {
  const shopItems = document.querySelectorAll(".shop-item");
  shopItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      const id = e.target.closest(".shop-item").dataset.shopId;
      geojson.eachLayer(function (layer) {
        if (layer.feature.properties.id == id) {
          zoomToFeature(layer, "lista");
        }
      });
    });
  });
}

// SEARCH in right panel
// --------------------------------------------------

function searchText() {
  const input = document.getElementById("search-shop");
  const filter = input.value.toUpperCase();
  const lists = document.querySelectorAll(".shops-list > li");
  const category = document.querySelectorAll(".shop-category");

  console.log("filter", filter.length);

  for (i = 0; i < lists.length; i++) {
    item = lists[i].textContent;
    className = lists[i].className;

    if (item.toUpperCase().indexOf(filter) > -1) {
      lists[i].style.display = "";
    } else {
      lists[i].style.display = "none";
    }
  }

  // hide category when value is more than 1
  if (filter.length >= 1) {
    category.forEach((el) => {
      el.parentNode.style.display = "none";
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const search = document.getElementById("search-shop");
  search.addEventListener("input", searchText);
});

function setActiveMenuItem(id, where) {
  const lists = document.querySelectorAll(".shops-list > li");
  const array = [].slice.call(lists);

  array.forEach((item) => {
    item.classList.remove("active-shop");
  });

  const item = array.find((item) => item.dataset.shopId == id);
  item.classList.add("active-shop");

  // scroll to element
  if (where) return;
  const ulElement = document.querySelector(".shops-list");
  ulElement.scrollTo(0, item.offsetTop - ulElement.offsetTop);
}

function removeActiveItem() {
  const lists = document.querySelectorAll(".shops-list > li");
  const array = [].slice.call(lists);

  array.forEach((item) => {
    item.removeAttribute("style");
  });
}
