/* eslint-disable no-undef */
/**
 * Polygon wuth gradient
 */

// config map
let config = {
  minZoom: 7,
  maxZoom: 18,
};

// calling map
const map = L.map("map", config);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// ---------------------------------------------

// polygon lat/lng
const polygon = [
  [52.233562395314294, 20.988811254501346],
  [52.232543907723446, 20.98472356796265],
  [52.23159110785402, 20.98845720291138],
];

// ---------------------------------------------
// Create polygon with gradient

L.Polygon.Gradient = L.Polygon.extend({
  onAdd: function (map) {
    L.Polygon.prototype.onAdd.call(this, map);

    const svgGradient = this._createGradient(
      this.options.gradient.id,
      this.options.gradient.gradientStops,
      this.options.gradient.type
    );

    // add gradient to svg
    this._renderer._container.appendChild(svgGradient);

    // set gradient on polygon
    this._path.setAttribute("fill", "url(#" + this.options.gradient.id + ")");

    // add shadow
    this._addShadow();
  },

  // create gradient
  _createGradient(id, colors, type) {
    const svgNS = "http://www.w3.org/2000/svg";
    const gradient = document.createElementNS(svgNS, type);

    gradient.setAttribute("id", id);

    // set rotation
    this._setRotation(gradient);

    for (let i = 0; i < colors.length; i++) {
      let stopInfo = colors[i];
      let stop = document.createElementNS(svgNS, "stop");
      // stop.setAttribute("offset", (i / (colors.length - 1)) * 100 + "%");
      stop.setAttribute("offset", stopInfo.offset);
      stop.setAttribute("stop-color", stopInfo.color);

      if (stopInfo.opacity) {
        stop.setAttribute("stop-opacity", stopInfo.opacity);
      }

      gradient.appendChild(stop);
    }

    const defs = document.createElementNS(svgNS, "defs");
    defs.appendChild(gradient);

    return gradient;
  },

  // add shadow
  _addShadow: function () {
    const { offsetX, offsetY, blur, color } = this.options.shadow;

    let shadowStyle = `
      filter: drop-shadow(${offsetX}px ${offsetY}px ${blur}px ${color})`;

    this._path.style = this._path.style.cssText + ";" + shadowStyle;
  },

  // convert degrees to radians
  _degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  },

  // set rotation
  _setRotation(linearGradient) {
    if (!this.options.gradient.rotation) return;

    const rotation = this._degreesToRadians(this.options.gradient.rotation);

    const x1 = 0;
    const y1 = 0;
    const x2 = Math.cos(rotation) * 100;
    const y2 = Math.sin(rotation) * 100;

    linearGradient.setAttribute("x1", x1 + "%");
    linearGradient.setAttribute("y1", y1 + "%");
    linearGradient.setAttribute("x2", x2 + "%");
    linearGradient.setAttribute("y2", y2 + "%");
  },
});

// ---------------------------------------------
// gradient stops

const gradientStops = [
  { offset: "0%", color: "rgb(131,58,180)", opacity: "1" },
  { offset: "50%", color: "rgb(253,29,29)", opacity: "0.5" },
  { offset: "100%", color: "rgb(252,176,69)", opacity: "1" },
];

// ---------------------------------------------
// create polygon with gradient

const polygonObject = new L.Polygon.Gradient(polygon, {
  gradient: {
    type: "linearGradient", // radialGradient
    id: "gradientName",
    gradientStops,
    rotation: 20,
  },
  shadow: {
    color: "#FF2400",
    blur: 20,
    offsetX: 10,
    offsetY: 15,
  },
  fillOpacity: 1,
  smoothFactor: 1,
  weight: 5,
  dashArray: "10, 10",
  stroke: true,
  color: "#000",
})
  .bindPopup("ta-da! Polygon with gradien and shadow")
  .addTo(map);

// ---------------------------------------------
// set view on polygonObject

map.fitBounds(polygonObject.getBounds(), {
  maxZoom: 17,
});
