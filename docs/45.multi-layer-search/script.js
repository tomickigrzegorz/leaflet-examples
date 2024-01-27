/* eslint-disable no-undef */
/**
 * multi-layer serch
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

// --------------------------------------------------

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

// fetching data from geojson
const poiLayers = L.layerGroup().addTo(map);

// add data to geoJSON layer and add to LayerGroup
["bar", "pharmacy", "restaurant"].map((json) => {
  fetchData(`./data/${json}.json`).then((data) => {
    L.geoJSON(data, geojsonOpts).addTo(poiLayers);
  });
});

// Autocomplete
// configurate https://github.com/tomickigrzegorz/autocomplete#configuration-of-the-plugin
// --------------------------------------------------

new Autocomplete("multi-layer-serch", {
  cache: true,
  selectFirst: true,

  onSearch: ({ currentValue }) => {
    let places = []; // array of places

    /**
     * Get places from geojson and push them to places array
     */
    poiLayers.eachLayer(function (layer) {
      if (layer instanceof L.LayerGroup) {
        layer.eachLayer(function (layer) {
          if (layer instanceof L.Marker) {
            places.push(layer.feature);
          }
        });
      }
    });

    // filter places by currentValue
    return places
      .sort((a, b) => a.properties.name.localeCompare(b.properties.name))
      .filter((element) =>
        element.properties.name.match(new RegExp(currentValue, "i"))
      );
  },

  // render the list of places
  onResults: ({ currentValue, matches, template }) => {
    // checking if we have results if we don't
    // take data from the noResults method
    return matches === 0
      ? template
      : matches
          .map((element) => {
            return `
              <li class="place">
                <div>${element.properties.name.replace(
                  new RegExp(currentValue, "i"),
                  (str) => `<mark>${str}</mark>`
                )}</div>
                <div class="place-item ${element.properties.amenity}">${
              element.properties.amenity
            }</div>
              </li> `;
          })
          .join("");
  },

  // fly to the place and open popup
  onSubmit: ({ object }) => {
    const [lat, lng] = object.geometry.coordinates;

    // fly to coordinates
    map.flyTo([lng, lat]);

    // find marker in the layer and open it
    poiLayers.eachLayer(function (layer) {
      layer.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
          if (layer.feature.id === object.id) {
            layer.openPopup();
          }
        }
      });
    });
  },

  // no results
  noResults: ({ currentValue, template }) =>
    template(`<li>No results found: "${currentValue}"</li>`),
});

// --------------------------------------------------
// legends

// the control element is placed in the bottom right corner
const legend = L.control({
  position: "bottomright",
});

// color table
const color = ["be4dff", "ff8146", "ff3939"];

// table of texts that will appear in the popup and legend
const label = ["bar", "pharmacy", "restaurant"];

const rows = [];
legend.onAdd = function () {
  // we create a div with a legend class
  const div = L.DomUtil.create("div", "legend");

  L.DomEvent.disableClickPropagation(div);

  color.map((item, index) => {
    rows.push(`
        <div class="row" style="margin: 1px auto;">
          <i style="background: #${item}"></i>${label[index]}
        </div>  
    `);
  });
  div.innerHTML = rows.join("");
  return div;
};

// we are adding a legend to the map
legend.addTo(map);
