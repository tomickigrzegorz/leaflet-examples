/* eslint-disable no-undef */
/**
 * geocoding addresses search engine outside the map
 */

window.addEventListener('DOMContentLoaded', function () {
  // Autocomplete
  new Autocomplete('search', {
    delay: 1000,
    clearButton: true,
    selectFirst: true,
    howManyCharacters: 2,
    onSearch: function (input) {
      const api = `https://nominatim.openstreetmap.org/search?format=geojson&limit=5&q=${encodeURI(
        input
      )}`;

      // You can also use static files
      // const api = './search.json'

      /**
       * jquery
       * If you want to use jquery you have to add the
       * jquery library to head html
       * https://cdnjs.com/libraries/jquery
       */
      // return $.ajax({
      //   url: api,
      //   method: 'GET',
      // })
      //   .done(function (data) {
      //     return data
      //   })
      //   .fail(function (xhr) {
      //     console.error(xhr);
      //   });

      // OR ----------------------------------

      /**
       * axios
       * If you want to use axios you have to add the
       * axios library to head html
       * https://cdnjs.com/libraries/axios
       */
      // return axios.get(api)
      //   .then((response) => {
      //     return response.data;
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });

      // OR ----------------------------------

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
    // nominatim
    onResults: (matches, input) => {
      const regex = new RegExp(input, 'i');
      return matches
        .map((element) => {
          return `
          <li class="autocomplete-item loupe" role="option" aria-selected="false">
            <p>
              ${element.properties.display_name.replace(
            regex,
            (str) => `<b>${str}</b>`
          )}
            </p>
          </li> `;
        })
        .join('');
    },
    onSubmit: (matches, input) => {
      console.log(matches);
      const { display_name } = matches.properties;
      const cord = matches.geometry.coordinates;
      // custom id for marker
      const customId = Math.random();

      const marker = L.marker([cord[1], cord[0]], {
        title: display_name,
        id: customId,
      })
        .addTo(map)
        .bindPopup(display_name);

      map.setView([cord[1], cord[0]], 8);

      map.eachLayer(function (layer) {
        if (layer.options && layer.options.pane === 'markerPane') {
          if (layer.options.id !== customId) {
            map.removeLayer(layer);
          }
        }
      });
    },
  });

  // MAP
  const config = {
    minZoom: 6,
    maxZomm: 18,
  };
  // magnification with which the map will start
  const zoom = 3;
  // co-ordinates
  const lat = 52.22977;
  const lng = 21.01178;

  // calling map
  const map = L.map('map', config).setView([lat, lng], zoom);

  // Used to load and display tile layers on the map
  // Most tile servers require attribution, which you can set under `Layer`
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
});
