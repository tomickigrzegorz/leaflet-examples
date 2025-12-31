const config = { minZoom: 5, maxZoom: 18 };
const zoom = 8;
const lat = 52.22977;
const lng = 21.01178;
const MARKER_FILE = "100000-markers.json";

const map = L.map("map", config).setView([lat, lng], zoom);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);
map.attributionControl.remove();

// --- interface elements ---
const statusBar = document.createElement("div");
statusBar.id = "status-bar";
statusBar.style.position = "absolute";
statusBar.style.bottom = "10px";
statusBar.style.left = "10px";
statusBar.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
statusBar.style.color = "white";
statusBar.style.padding = "6px 12px";
statusBar.style.borderRadius = "8px";
statusBar.style.fontSize = "14px";
statusBar.style.zIndex = 1000;
statusBar.textContent = "🔍 Markers: 0 | ⏱ Time: 0 ms";
document.body.appendChild(statusBar);

function updateStatusBar(count, duration = null) {
  const timeText =
    duration !== null ? ` | ⏱ Time: ${duration.toFixed(0)} ms` : "";
  statusBar.textContent = `🔍 Markers: ${count}${timeText}`;
}

// --- Control load / clear ---
const CustomControl = L.Control.extend({
  options: { position: "topleft" },

  onAdd: (map) => {
    const container = L.DomUtil.create(
      "div",
      "leaflet-bar leaflet-control leaflet-control-custom"
    );

    const btnLoad = L.DomUtil.create("a", "", container);
    btnLoad.href = "#";
    btnLoad.title = "Load markers";
    btnLoad.innerHTML = "+";
    btnLoad.style.cssText =
      "font-size:2rem;text-align:center;line-height:100%;cursor:pointer;user-select:none;background-color:#3080f8;color:#fff;border-bottom:1px solid #484848;";

    const btnClear = L.DomUtil.create("a", "", container);
    btnClear.href = "#";
    btnClear.title = "Delete database";
    btnClear.innerHTML = "-";
    btnClear.style.cssText =
      "font-size:2rem;text-align:center;line-height:82%;cursor:pointer;user-select:none;background-color:#ff0000;color:#fff;";

    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);

    btnLoad.onclick = async (e) => {
      e.preventDefault();
      if (!markersLoaded) {
        showSpinner();
        markerLoadStartTime = performance.now();
        const markers = await loadMarkers();
        await updateMarkersIfNeeded(markers);
        worker.postMessage({ type: "init", data: markers });
        markersLoaded = true;
      }
    };

    btnClear.onclick = async (e) => {
      e.preventDefault();
      await clearMarkersDB();
      updateStatusBar(0, 0);
    };

    return container;
  },
});

map.addControl(new CustomControl());

// --- Spinner ---
function showSpinner() {
  document.getElementById("loader").classList.remove("hidden");
}
function hideSpinner() {
  document.getElementById("loader").classList.add("hidden");
}

// --- IndexedDB ---
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("markersDB", 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("markers")) {
        db.createObjectStore("markers", { keyPath: "id" });
      }
    };
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = () => reject("Error opening IndexedDB");
  });
}

async function saveMarkersToDB(markers) {
  const db = await openIndexedDB();
  const transaction = db.transaction(["markers"], "readwrite");
  const store = transaction.objectStore("markers");
  markers.forEach((marker) => store.put(marker));
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject("Error saving markers");
  });
}

async function getMarkersFromDB() {
  const db = await openIndexedDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["markers"], "readonly");
    const store = transaction.objectStore("markers");
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("Error reading markers from DB");
  });
}

async function countMarkersInDB() {
  const db = await openIndexedDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["markers"], "readonly");
    const store = transaction.objectStore("markers");
    const countRequest = store.count();
    countRequest.onsuccess = () => resolve(countRequest.result);
    countRequest.onerror = () => reject("Error counting markers in DB");
  });
}

async function updateMarkersIfNeeded(newMarkers) {
  const existingCount = await countMarkersInDB();
  if (existingCount < newMarkers.length) {
    const existingMarkers = await getMarkersFromDB();
    const existingIds = new Set(existingMarkers.map((m) => m.id));
    const markersToAdd = newMarkers.filter((m) => !existingIds.has(m.id));
    if (markersToAdd.length > 0) {
      await saveMarkersToDB(markersToAdd);
    }
  }
}

async function clearMarkersDB() {
  return new Promise((resolve, reject) => {
    const deleteRequest = indexedDB.deleteDatabase("markersDB");
    deleteRequest.onsuccess = async () => {
      markerClusterGroup.clearLayers();
      worker.postMessage({ type: "clear" });
      markersLoaded = false;
      // await openIndexedDB();
      resolve();
    };
    deleteRequest.onerror = () => reject("Error deleting markersDB");
    deleteRequest.onblocked = () =>
      reject("Delete blocked: close other DB connections");
  });
}

// --- Worker + Clustering ---
const worker = new Worker("showMarkerWorker.js");
const markerClusterGroup = L.markerClusterGroup({
  // chunkedLoading: true,
  maxClusterRadius: 50,
  disableClusteringAtZoom: 16,
});
map.addLayer(markerClusterGroup);

let markerLoadStartTime = 0;
let markersLoaded = false;

worker.onmessage = (e) => {
  const { type, markers } = e.data;

  if (type === "init-complete") {
    updateVisibleMarkers();
    hideSpinner();
    return;
  }

  if (type === "filter-results") {
    markerClusterGroup.clearLayers();
    const leafletMarkers = markers.map(({ minX: lng, minY: lat, id }) =>
      L.marker([lat, lng], { title: `Marker ${id}` }).bindPopup(
        `🧷 Marker ID: ${id}`
      )
    );
    markerClusterGroup.addLayers(leafletMarkers);

    const duration = performance.now() - markerLoadStartTime;
    updateStatusBar(markers.length, duration);
    markerLoadStartTime = 0;

    hideSpinner();
  }
};

map.on(
  "moveend",
  throttle(() => markersLoaded && updateVisibleMarkers(), 200)
);
map.on(
  "zoomend",
  throttle(() => markersLoaded && updateVisibleMarkers(), 200)
);

function updateVisibleMarkers() {
  showSpinner();
  markerLoadStartTime = performance.now();

  const bounds = map.getBounds();
  const padding = 0.03;
  const bbox = {
    minX: bounds.getWest() - padding,
    minY: bounds.getSouth() - padding,
    maxX: bounds.getEast() + padding,
    maxY: bounds.getNorth() + padding,
  };

  worker.postMessage({ type: "filter", bounds: bbox });
}

function throttle(func, limit) {
  let inThrottle;
  return function () {
    if (!inThrottle) {
      func.apply(this, arguments);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// --- loading markers ---
async function loadMarkers() {
  showSpinner();
  let markers = [];

  try {
    markers = await getMarkersFromDB();
    if (!markers.length) throw new Error("DB empty");
  } catch {
    const res = await fetch(MARKER_FILE);
    const data = await res.json();

    const bounds = map.getBounds();
    const padding = 0.03;
    const expandedBounds = {
      minX: bounds.getWest() - padding,
      minY: bounds.getSouth() - padding,
      maxX: bounds.getEast() + padding,
      maxY: bounds.getNorth() + padding,
    };

    const visibleNow = [];
    const preparedMarkers = data.map((m, i) => {
      const marker = { lat: m.lat, lng: m.lng, id: i };
      if (
        marker.lat >= expandedBounds.minY &&
        marker.lat <= expandedBounds.maxY &&
        marker.lng >= expandedBounds.minX &&
        marker.lng <= expandedBounds.maxX
      ) {
        const leafletMarker = L.marker([marker.lat, marker.lng], {
          title: `Marker ${marker.id}`,
        }).bindPopup(`🧷 Marker ID: ${marker.id}`);
        visibleNow.push(leafletMarker);
      }
      return marker;
    });

    markerClusterGroup.addLayers(visibleNow);
    updateStatusBar(visibleNow.length);

    await saveMarkersToDB(preparedMarkers);
    markers = preparedMarkers;
  }

  hideSpinner();
  return markers;
}
