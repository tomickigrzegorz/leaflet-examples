/* eslint-disable no-undef */
/**
 * autocomplete with geojson
 */

// config map
let config = {
  minZoom: 7,
  maxZoom: 18,
  zoomControl: false, // zoom control off
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
L.control.zoom({ position: "topright" }).addTo(map);

// --------------------------------------------------------------
L.Control.Search = L.Control.extend({
  options: {
    position: "topleft",
  },
  onAdd: function () {
    const container = L.DomUtil.create("div", "autocomplete-container");

    L.DomEvent.disableClickPropagation(container);

    container.insertAdjacentHTML(
      "beforeend",
      `<div class="auto-search-wrapper loupe">
        <input type="text" id="local" autocomplete="off" placeholder="Enter e or p" />
      </div>`
    );

    return container;
  },
});

new L.Control.Search().addTo(map);

// --------------------------------------------------------------
let geojsonarray = [];

new Autocomplete("local", {
  onSearch: ({ currentValue }) => {
    // local data
    const api = "./data.geojson";
    return new Promise((resolve) => {
      fetch(api)
        .then((response) => response.json())
        .then((data) => {
          const result = data.features
            .sort((a, b) =>
              a.properties.title.localeCompare(b.properties.title)
            )
            .filter((element) => {
              return element.properties.title.match(
                new RegExp(currentValue, "gi")
              );
            });
          resolve(result);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  },

  onResults: ({ matches, template }) => {
    return matches === 0
      ? template
      : matches
          .map((el) => {
            const icon =
              el.properties.type === "rectangle"
                ? "polygon"
                : el.properties.type.toLowerCase();
            return `
            <li>
              <div class="title">${el.properties.title}</div>
              <svg class="icon"><use xlink:href="#icon-${icon}"></use></svg>
            </li>`;
          })
          .join("");
  },

  onSubmit: ({ object }) => {
    const geojsonlayer = L.geoJSON(object, {
      style: function (feature) {
        return {
          color: feature.properties.color || "red",
          weight: 7,
          opacity: 1,
          fillOpacity: 0.7,
        };
      },
      pointToLayer: (feature, latlng) => {
        if (feature.properties.type === "circle") {
          return new L.circle(latlng, {
            radius: feature.properties.radius,
          });
        } else if (feature.properties.type === "circlemarker") {
          return new L.circleMarker(latlng, {
            radius: 20,
          });
        } else {
          return new L.Marker(latlng);
        }
      },
      onEachFeature: function (feature, layer) {
        const coordinates = feature.geometry.coordinates.toString();
        const result = coordinates.match(/[^,]+,[^,]+/g);

        layer.bindPopup(
          "<span>Coordinates:<br>" + result.join("<br>") + "</span>"
        );
      },
    });

    map.fitBounds(geojsonlayer.getBounds(), { padding: [150, 150] });

    if (geojsonarray.includes(object.properties.id)) return;
    geojsonarray.push(object.properties.id);

    geojsonlayer.addTo(map);
  },

  noResults: ({ currentValue, template }) =>
    template(`<li>No results found: "${currentValue}"</li>`),

  onReset: () => {
    // remove all layers
    map.eachLayer(function (layer) {
      if (!!layer.toGeoJSON) {
        map.removeLayer(layer);
      }
    });
    geojsonarray = [];
  },
});
