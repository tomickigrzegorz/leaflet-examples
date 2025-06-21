const fs = require("fs");

// 🔧 Configuration
const markerCount = 100_000; // How many markers to generate
const centerLat = 52.22977; // Center latitude (Warsaw)
const centerLng = 21.01178; // Center longitude (Warsaw)
const radiusKm = 50; // Radius in kilometers around the center point

// 📍 Calculate bounding box coordinates
function getBoundsFromCenter(lat, lng, radiusKm) {
  const deltaLat = radiusKm / 111; // 1° latitude ≈ 111 km
  const deltaLng = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));
  return {
    latMin: lat - deltaLat,
    latMax: lat + deltaLat,
    lngMin: lng - deltaLng,
    lngMax: lng + deltaLng,
  };
}

// 🔢 Randomize coordinates within the given range
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

// 🎯 Generate markers
function generateMarkers(count, bounds) {
  const markers = [];
  for (let i = 0; i < count; i++) {
    const lat = randomInRange(bounds.latMin, bounds.latMax);
    const lng = randomInRange(bounds.lngMin, bounds.lngMax);
    markers.push({ lat, lng });
  }
  return markers;
}

// 🛠 Start
console.log("📦 Generowanie markerów...");
const bounds = getBoundsFromCenter(centerLat, centerLng, radiusKm);
const markers = generateMarkers(markerCount, bounds);

// 💾 Saving to file
// fs.writeFileSync("test-markers.json", JSON.stringify(markers, null, 2));
fs.writeFileSync(`${markerCount}-markers.json`, JSON.stringify(markers));
console.log(`✅ Done! ${markerCount} markers saved to markers.json`);
