/* eslint-disable no-undef */
/**
 * follow mouse
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

// add legend
// ------------------------------
const legend = L.control({ position: "bottomleft" });

legend.onAdd = function () {
  let div = L.DomUtil.create("div", "description");
  L.DomEvent.disableClickPropagation(div);
  const text = "Move the mouse";
  div.insertAdjacentHTML("beforeend", text);
  return div;
};

legend.addTo(map);

// follow mouse
// ------------------------------
const followMouse = document.createElement("div");
followMouse.className = "follow-mouse";
document.body.appendChild(followMouse);

const mapCointainer = document.querySelector("#map");

mapCointainer.addEventListener("mousemove", function (e) {
  const { offsetWidth: mapWidth, offsetHeight: mapHeight } = e.target;
  const { offsetWidth: cordWidth, offsetHeight: cordHeight } = followMouse;

  // get co-ordinates
  let { xp, yp } = getCoords(e);

  // convert point x,y to latlng
  const point = L.point(xp, yp);
  const coordinates = map.containerPointToLatLng(point);

  // add coordinates to the div
  followMouse.textContent = coordinates;

  // set the position of the div
  xp = xp + 20 + cordWidth > mapWidth ? xp - cordWidth - 10 : xp + 10;
  yp = yp + 20 + cordHeight > mapHeight ? yp - cordHeight - 10 : yp + 10;

  // followMouse.style.transform = `translate(${xp}px, ${-yp}px)`;
  followMouse.style.left = `${xp}px`;
  followMouse.style.top = `${yp}px`;
});

function getCoords(e) {
  let mouseX = e.clientX;
  let mouseY = e.clientY;

  return {
    xp: parseInt(mouseX),
    yp: parseInt(mouseY),
  };
}
