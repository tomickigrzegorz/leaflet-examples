/* eslint-disable no-undef */
/**
 * contextmenu
 */

const moonCord = {
  lat: 40.7412684,
  lng: -74.0284178,
};

// config map
let config = {
  minZoom: 7,
  maxZoom: 18,
};
// magnification with which the map will start
const zoom = 17;
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

// ------------------------------------------
// custom icon and popup

const funny = L.icon({
  iconUrl: "http://grzegorztomicki.pl/serwisy/pin.png",
  iconSize: [50, 58], // size of the icon
  iconAnchor: [20, 58], // changed marker icon position
  popupAnchor: [0, -60], // changed popup position
});

// create popup contents
const customPopup =
  '<iframe width="320" height="180" src="https://www.youtube.com/embed/OzG6QVjQBAs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';

// specify popup options
const customOptions = {
  maxWidth: "auto", // set max-width
  className: "customPopup", // name custom popup
};

// create marker object, pass custom icon as option, pass content and options to popup, add to map
const marker = L.marker([moonCord.lat, moonCord.lng], {
  icon: funny,
}).bindPopup(customPopup, customOptions);

marker.addTo(map);

// ------------------------------------------
// data for context menu
const contextmenuItems = [
  {
    text: "🗺 Show coordinates",
    callback: showCoordinates,
  },
  {
    text: "🚀 Fly Me To The Moon",
    callback: centerMap,
  },
  {
    text: "🏠 Back to home",
    callback: backToHome,
  },
  {
    text: "Zoom in",
    callback: zoomIn,
  },
  {
    text: "Zoom out",
    callback: zoomOut,
  },
];

// global variable to store the coordinates
let latlngObj = {
  lat: 0,
  lng: 0,
};

// callbacks function
function showCoordinates(e) {
  console.log(latlngObj);
  const coordinatesLabel = document.querySelector(".coordinates-label");
  coordinatesLabel.style.display = "block";
  coordinatesLabel.innerText = `Lat: ${latlngObj.lat} Lng: ${latlngObj.lng}`;
  hideMenu();
}

function centerMap(e) {
  map.flyTo([moonCord.lat, moonCord.lng], 17, { animate: true, duration: 10 });

  map.on("moveend", function () {
    marker.openPopup();
    showCoordinatesLabel.innerHTML =
      "<a href='https://en.wikipedia.org/wiki/Statue_of_Frank_Sinatra' target='_blank'>Open wiki: Statue of Frank Sinatra</a>";
  });

  hideMenu();
}

function backToHome() {
  map.flyTo([lat, lng], zoom);
  marker.closePopup();
  removeTextFromLabel();
  hideMenu();
}

function zoomIn() {
  map.zoomIn();
  hideMenu();
}

function zoomOut() {
  map.zoomOut();
  hideMenu();
}

// hide context menu
function hideMenu() {
  const ul = document.querySelector(".context-menu");
  ul.removeAttribute("style");
  ul.classList.remove("is-open");
}

// create context menu
function createMenu() {
  const menu = document.createElement("ul");
  menu.classList.add("context-menu");
  menu.setAttribute("data-contextmenu", "0");
  contextmenuItems.forEach((item) => {
    const li = document.createElement("li");
    li.innerText = item.text;
    li.addEventListener("click", item.callback);
    menu.appendChild(li);
  });

  return menu;
}

// append context menu to the body
document.body.appendChild(createMenu());

// coordinate label
const showCoordinatesLabel = document.createElement("p");
showCoordinatesLabel.classList.add("coordinates-label");
removeTextFromLabel();

document.body.appendChild(showCoordinatesLabel);

function removeTextFromLabel() {
  showCoordinatesLabel.textContent = "right click on the map";
}

// Add context menu to the map
var menu = document.querySelector("#map");
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();

  // show context menu
  show(e);
});

function show(e) {
  const ul = document.querySelector("ul");
  ul.style.display = "block";
  ul.style.left = `${e.pageX}px`;
  ul.style.top = `${e.pageY}px`;
  ul.classList.add("is-open");

  ul.focus();

  const point = L.point(e.pageX, e.pageY);
  const coordinates = map.containerPointToLatLng(point);

  latlngObj = { ...latlngObj, ...coordinates };

  e.preventDefault();
}

// ------------------------------------------

window.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("wheel", hideMenu);

  ["zoomstart", "resize", "click", "move"].forEach((eventType) => {
    map.on(eventType, hideMenu);
  });
});
