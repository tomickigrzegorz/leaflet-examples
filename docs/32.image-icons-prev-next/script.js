/* eslint-disable no-undef */
/**
 * Image icons prev/next
 */

// config map
let config = {
  minZoom: 7,
  maxZoom: 18,
};
// magnification with which the map will start
const zoom = 17;
// coordinates
const lat = 52.2294;
const lng = 21.01;

// coordinate array with popup text
const points = [
  {
    lat: 52.228785157729114,
    lng: 21.006867885589603,
    title: "Lviv",
    image: "https://grzegorztomicki.pl/images/lwow/576/IMG_0202.jpg",
  },
  {
    lat: 52.22923201880194,
    lng: 21.00897073745728,
    title: "China",
    image: "https://grzegorztomicki.pl/images/chiny/576/IMG_8413.jpg",
  },
  {
    lat: 52.22963944703663,
    lng: 21.01091265678406,
    title: "Morocco",
    image: "https://grzegorztomicki.pl/images/maroko/576/IMG_0738.jpg",
  },
  {
    lat: 52.229928587386496,
    lng: 21.01218938827515,
    title: "Israel",
    image: "https://grzegorztomicki.pl/images/izrael/576/IMG_2071.jpg",
  },
];

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// --------------------------------------------------

// we create an array of markers
// each marker has a unique title
// of course this could be another parameter
for (let i = 0; i < points.length; i++) {
  const { lat, lng, title, image } = points[i];

  // create specific icon
  const myIcon = L.icon({
    iconUrl: image,
    className: "image-icon",
    iconSize: [100, 60],
    iconAnchor: [50, 50],
    popupAnchor: [0, -40],
  });

  // create marker and add to map
  let marker = L.marker([lat, lng], { icon: myIcon }).addTo(map);

  const idMarker = marker._leaflet_id;

  // add to marker popup
  marker.bindPopup(`
      <div style="text-align: center;">
        <div style="text-transform: uppercase; font-weight: bold;">${title} id: ${idMarker}<div>
      </div>
    `);

  // click on marker center marker on map
  marker.on("click", centerOnMarker);

  // generate bottom menu with markers
  generateMenu(idMarker, title);
}

// generate menu
function generateMenu(id, title) {
  const city = document.querySelector(".city");
  const hrefElement = `<a id="${id}" title="${title} MARKER-ID:${id}" class="marker-click" href="#">${title}</a>`;
  city.insertAdjacentHTML("beforeend", hrefElement);
}

// function get layer id
function markerOpen(id) {
  map.eachLayer(function (layer) {
    if (layer.options) {
      if (layer._leaflet_id === id) {
        centerMarker(layer);
      }
    }
  });
}

// function open popup and centering
// the map on the marker
function centerMarker(layer) {
  layer.openPopup();
  map.panTo(L.latLng(layer.getLatLng()));
}

// center on marker when click
function centerOnMarker(e) {
  const el = e.target._leaflet_id;

  const element = document.getElementById(el);
  // remove active menu
  removeActiveMenu(element);

  // find element in array
  const indexActivePopup = points.findIndex((x, index) => index === el);

  // active pre/next menu
  activeControls(indexActivePopup);

  map.setView(e.target.getLatLng(), zoom);
}

// active bottom menu arrow
function activeControls(index) {
  next.classList.add("disabled");
  prev.classList.remove("disabled");

  if (index > 0 && index < countMarker) {
    next.classList.remove("disabled");
    prev.classList.remove("disabled");
  } else if (index === 0) {
    prev.classList.add("disabled");
    next.classList.remove("disabled");
  }
}

// remove active menu
function removeActiveMenu(el) {
  const active = document.querySelector(".active");

  if (active) {
    active.classList.remove("active");
  }
  el.classList.add("active");
}

const markersDiv = document.querySelectorAll(".marker-click");
const buttonControls = document.querySelectorAll(".button-controls");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const countMarker = markersDiv.length - 1;

// all marker-click classes from html
markersDiv.forEach((marker, index) => {
  marker.addEventListener("click", (e) => {
    e.preventDefault();

    // remove active menu
    removeActiveMenu(e.target);

    // active pre/next menu
    activeControls(index);

    // the click event transfers to the function
    // id = title of the marker
    markerOpen(Number(e.target.id));
  });
});

// click on prev, next
buttonControls.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();

    const btn = e.target.classList[1];

    let index = Array.from(markersDiv).findIndex((x) =>
      x.classList.contains("active")
    );

    index = btn === "prev" ? index - 1 : index + 1;

    const element = Array.from(markersDiv)[index];
    removeActiveMenu(element);

    // open specific marker
    markerOpen(Number(element.id));

    // active pre/next menu
    activeControls(index);
  });
});
