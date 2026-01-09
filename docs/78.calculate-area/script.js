/* eslint-disable no-undef */
/**
 * calculate area
 */

// config map
const config = {
  minZoom: 7,
  maxZoom: 18,
};
const zoom = 18;
const lat = 52.22941;
const lng = 21.01178;

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// ------------------ Polygon ------------------

// function to convert degrees to radians
function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

// function to calculate the area of a polygon
function calculatePolygonArea(latlngs) {
  // Earth's radius in meters
  const R = 6378137;

  // number of points
  const pointsCount = latlngs.length;

  if (pointsCount < 3) return 0;

  let area = 0;

  for (let i = 0; i < pointsCount; i++) {
    const p1 = latlngs[i];
    const p2 = latlngs[(i + 1) % pointsCount];

    const lat1 = toRadians(p1.lat);
    const lon1 = toRadians(p1.lng);
    const lat2 = toRadians(p2.lat);
    const lon2 = toRadians(p2.lng);

    area += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }

  area = (Math.abs(area) * (R * R)) / 2;

  return area;
}

// ---------------------------------------------

// layer group
const layers = L.layerGroup().addTo(map);

// polygon
const polygonsArea = [
  [52.2303720513083, 21.01182227649689],
  [52.229590161561866, 21.010928342628483],
  [52.22930430472933, 21.012029091316227],
  [52.23008958517418, 21.01269364356995],
];

// add polygon to layers
const polygon = L.polygon(polygonsArea, { color: "red" }).addTo(layers);

// polygon get center and create marker
const bounds = polygon.getBounds();
const center = bounds.getCenter();
const marker = L.marker(center).addTo(map);

const polygonArea = calculatePolygonArea(polygon.getLatLngs()[0]);

// add tooltip to marker
marker.bindTooltip(`Area: ${polygonArea.toFixed(5)} m²`, {
  permanent: true,
  direction: "bottom",
  className: "area",
  offset: [-15, 30],
});

const markerCircle = [52.22896, 21.0121];
const circleMarker = L.circle(markerCircle, {
  color: "blue",
  radius: 50,
}).addTo(layers);

// calculate area of circle
const circleArea = Math.PI * 50 ** 2;

// add tooltip to circle marker
circleMarker.bindTooltip(`Area: ${circleArea.toFixed(5)} m²`, {
  permanent: true,
  direction: "bottom",
  className: "area",
});
