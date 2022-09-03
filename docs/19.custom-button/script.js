/* eslint-disable no-undef */
/**
 * Custom button
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

// create custom button
const customControl = L.Control.extend({
  // button position
  options: {
    position: "topright",
  },

  // method
  onAdd: function (map) {
    // create button
    const btn = L.DomUtil.create("button");
    btn.title = "pooooooooooooop rotation";
    btn.textContent = "💩";
    btn.className = "pooooo";
    btn.setAttribute(
      "style",
      "background-color: transparent; width: 30px; height: 30px; border: none; display: flex; cursor: pointer; justify-content: center; font-size: 2rem;"
    );

    // actions on mouseover
    btn.onmouseover = function () {
      this.style.transform = "scale(1.3)";
    };

    // actions on mouseout
    btn.onmouseout = function () {
      this.style.transform = "scale(1)";
    };

    // action when clik on button
    btn.onclick = function () {
      // add class rotate
      document.body.classList.add("rotate");
      // remove class after 4s
      setTimeout(() => {
        document.body.classList.remove("rotate");
      }, 4000);
    };

    return btn;
  },
});

// adding new button to map controll
map.addControl(new customControl());
