/* eslint-disable no-undef */
/**
 * autocomplete on map
 * https://github.com/tomickigrzegorz/autocomplete
 *
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

// --------------------------------------------------------------
// create seearch button

// add "random" button
const buttonTemplate = `<div class="leaflet-search"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M31.008 27.231l-7.58-6.447c-0.784-0.705-1.622-1.029-2.299-0.998 1.789-2.096 2.87-4.815 2.87-7.787 0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-0.031 0.677 0.293 1.515 0.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007 0.23s0.997-2.903-0.23-4.007zM12 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"></path></svg></div><div class="auto-search-wrapper max-height"><input type="text" id="marker" autocomplete="off"  aria-describedby="instruction" aria-label="Search ..." /><div id="instruction" class="hidden">When autocomplete results are available use up and down arrows to review and enter to select. Touch device users, explore by touch or with swipe gestures.</div></div>`;

// create custom button
const customControl = L.Control.extend({
  // button position
  options: {
    position: "topleft",
    className: "leaflet-autocomplete",
  },

  // method
  onAdd: function () {
    return this._initialLayout();
  },

  _initialLayout: function () {
    // create button
    const container = L.DomUtil.create(
      "div",
      "leaflet-bar " + this.options.className
    );

    L.DomEvent.disableClickPropagation(container);

    container.innerHTML = buttonTemplate;

    return container;
  },
});

// adding new button to map controll
map.addControl(new customControl());

// --------------------------------------------------------------

// input element
const root = document.getElementById("marker");

function addClassToParent() {
  const searchBtn = document.querySelector(".leaflet-search");
  searchBtn.addEventListener("click", (e) => {
    // toggle class
    e.target
      .closest(".leaflet-autocomplete")
      .classList.toggle("active-autocomplete");

    // add placeholder
    root.placeholder = "Search ...";

    // focus on input
    root.focus();

    // use destroy method
    autocomplete.destroy();
  });
}

addClassToParent();

// function clear input
map.on("click", () => {
  document
    .querySelector(".leaflet-autocomplete")
    .classList.remove("active-autocomplete");

  clickOnClearButton();
});

// autocomplete section
// more config find in https://github.com/tomickigrzegorz/autocomplete
// --------------------------------------------------------------

const autocomplete = new Autocomplete("marker", {
  delay: 1000,
  selectFirst: true,
  howManyCharacters: 2,

  onSearch: function ({ currentValue }) {
    const api = `https://nominatim.openstreetmap.org/search?format=geojson&limit=5&q=${encodeURI(
      currentValue
    )}`;

    /**
     * Promise
     */
    return new Promise((resolve) => {
      fetch(api)
        .then((response) => response.json())
        .then((data) => {
          resolve(data.features);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  },

  onResults: ({ currentValue, matches, template }) => {
    const regex = new RegExp(currentValue, "i");
    // checking if we have results if we don't
    // take data from the noResults method
    return matches === 0
      ? template
      : matches
          .map((element) => {
            return `
              <li role="option">
                <p>${element.properties.display_name.replace(
                  regex,
                  (str) => `<b>${str}</b>`
                )}</p>
              </li> `;
          })
          .join("");
  },

  onSubmit: ({ object }) => {
    const { display_name } = object.properties;
    const cord = object.geometry.coordinates;
    // custom id for marker
    // const customId = Math.random();

    // remove last marker
    map.eachLayer(function (layer) {
      if (layer.options && layer.options.pane === "markerPane") {
        if (layer._icon.classList.contains("leaflet-marker-locate")) {
          map.removeLayer(layer);
        }
      }
    });

    // add marker
    const marker = L.marker([cord[1], cord[0]], {
      title: display_name,
    });

    // add marker to map
    marker.addTo(map).bindPopup(display_name);

    // set marker to coordinates
    map.setView([cord[1], cord[0]], 8);

    // add class to marker
    L.DomUtil.addClass(marker._icon, "leaflet-marker-locate");
  },

  // the method presents no results
  noResults: ({ currentValue, template }) =>
    template(`<li>No results found: "${currentValue}"</li>`),
});
