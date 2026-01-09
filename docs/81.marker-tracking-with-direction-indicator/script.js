/* eslint-disable no-undef */
/**
 * marker tracking with direction indicator
 */

// config map
const config = {
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

// Marker class to track selected marker and show direction indicator
class MarkerTracker {
  constructor(map, options = {}) {
    this.map = map;
    this.selectedMarker = null;
    this.directionIndicator = null;
    this.markers = [];
    this.updateInterval = null;

    // Padding configuration for each edge (top, right, bottom, left)
    this.padding = {
      top: options.paddingTop || 50,
      right: options.paddingRight || 50,
      bottom: options.paddingBottom || 50,
      left: options.paddingLeft || 50,
    };

    // Listen to map events
    this.map.on("move", () => this.updateDirectionIndicator());
    this.map.on("zoom", () => this.updateDirectionIndicator());
  }

  // Method to update padding dynamically
  setPadding(options) {
    if (options.top !== undefined) this.padding.top = options.top;
    if (options.right !== undefined) this.padding.right = options.right;
    if (options.bottom !== undefined) this.padding.bottom = options.bottom;
    if (options.left !== undefined) this.padding.left = options.left;
    this.updateDirectionIndicator();
  }

  addMarker(lat, lng, popupContent) {
    const marker = L.marker([lat, lng]).addTo(this.map);

    if (popupContent) {
      marker.bindPopup(popupContent);
    }

    // Click handler to select/deselect marker
    marker.on("click", () => {
      this.selectMarker(marker, lat, lng);
    });

    this.markers.push({
      marker: marker,
      lat: lat,
      lng: lng,
    });

    return marker;
  }

  selectMarker(marker, lat, lng) {
    // Deselect previous marker
    if (this.selectedMarker) {
      this.selectedMarker.marker.setOpacity(1);
      this.selectedMarker.marker.setIcon(
        L.icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        })
      );
    }

    // Select new marker
    this.selectedMarker = { marker: marker, lat: lat, lng: lng };
    marker.setOpacity(0.7);
    marker.setIcon(
      L.icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })
    );

    this.updateDirectionIndicator();
  }

  updateDirectionIndicator() {
    // Remove existing indicator
    if (this.directionIndicator) {
      this.map.removeControl(this.directionIndicator);
      this.directionIndicator = null;
    }

    // If no marker selected, return
    if (!this.selectedMarker) {
      return;
    }

    const bounds = this.map.getBounds();
    const markerLatLng = L.latLng(
      this.selectedMarker.lat,
      this.selectedMarker.lng
    );

    // Check if marker is in viewport
    if (bounds.contains(markerLatLng)) {
      // Marker is visible, no need for direction indicator
      return;
    }

    // Calculate direction from map center to marker
    const mapCenter = this.map.getCenter();
    const angle = this.calculateBearing(mapCenter, markerLatLng);
    const distance = mapCenter.distanceTo(markerLatLng);
    const markerData = this.selectedMarker;

    // Create direction indicator
    const DirectionIndicator = L.Control.extend({
      onAdd: (map) => {
        const container = L.DomUtil.create("div", "direction-indicator");

        // Calculate position on viewport edge
        const mapContainer = map.getContainer();
        const mapRect = mapContainer.getBoundingClientRect();
        const mapWidth = mapContainer.clientWidth;
        const mapHeight = mapContainer.clientHeight;

        // Get padding from tracker instance
        const paddingTop = this.padding.top;
        const paddingRight = this.padding.right;
        const paddingBottom = this.padding.bottom;
        const paddingLeft = this.padding.left;

        // Get marker position in pixels relative to map container
        const markerPoint = map.latLngToContainerPoint(markerLatLng);
        const centerX = mapWidth / 2;
        const centerY = mapHeight / 2;

        // Direction vector from center to marker
        const dx = markerPoint.x - centerX;
        const dy = markerPoint.y - centerY;

        // Calculate intersection with viewport edge
        let x;
        let y;

        // Calculate scale factors to reach each edge (with individual padding)
        const scaleRight =
          dx > 0
            ? (mapWidth - paddingRight - centerX) / dx
            : Number.POSITIVE_INFINITY;
        const scaleLeft =
          dx < 0 ? (paddingLeft - centerX) / dx : Number.POSITIVE_INFINITY;
        const scaleBottom =
          dy > 0
            ? (mapHeight - paddingBottom - centerY) / dy
            : Number.POSITIVE_INFINITY;
        const scaleTop =
          dy < 0 ? (paddingTop - centerY) / dy : Number.POSITIVE_INFINITY;

        // Find minimum positive scale (first edge hit)
        const scale = Math.min(
          scaleRight > 0 ? scaleRight : Number.POSITIVE_INFINITY,
          scaleLeft > 0 ? scaleLeft : Number.POSITIVE_INFINITY,
          scaleBottom > 0 ? scaleBottom : Number.POSITIVE_INFINITY,
          scaleTop > 0 ? scaleTop : Number.POSITIVE_INFINITY
        );

        // Calculate position on edge
        x = centerX + dx * scale;
        y = centerY + dy * scale;

        // Clamp to viewport bounds with individual padding for each edge
        x = Math.max(paddingLeft, Math.min(x, mapWidth - paddingRight));
        y = Math.max(paddingTop, Math.min(y, mapHeight - paddingBottom));

        // Calculate angle from indicator position to marker (in screen coordinates)
        // dy is inverted because screen Y goes down
        const screenAngle = Math.atan2(dx, -dy) * (180 / Math.PI);

        // Adjust for map container offset
        x += mapRect.left;
        y += mapRect.top;

        // Create wrapper for the whole indicator (circle + tail)
        container.style.cssText = `
          position: fixed;
          left: ${x}px;
          top: ${y}px;
          transform: translate(-50%, -50%);
          z-index: 1000;
          cursor: pointer;
        `;

        // Inner wrapper that rotates
        const rotatingWrapper = document.createElement("div");
        rotatingWrapper.style.cssText = `
          position: relative;
          transform: rotate(${screenAngle}deg);
          transition: all 0.15s ease;
        `;
        container.appendChild(rotatingWrapper);

        // White bubble tail using CSS triangle technique
        const tail = document.createElement("div");
        tail.style.cssText = `
          position: absolute;
          width: 0;
          height: 0;
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
          border-bottom: 25px solid white;
          left: 50%;
          top: -18px;
          transform: translateX(-50%);
          z-index: 0;
          filter: drop-shadow(0 -2px 2px rgba(0,0,0,0.15));
        `;
        rotatingWrapper.appendChild(tail);

        // Red circle with white border
        const circle = document.createElement("div");
        circle.style.cssText = `
          position: relative;
          width: 50px;
          height: 50px;
          background: #dc3545;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        `;
        rotatingWrapper.appendChild(circle);

        // Marker pin icon inside circle (rotated back to be upright)
        const pin = document.createElement("div");
        pin.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>`;
        pin.style.cssText = `
          transform: rotate(${-screenAngle}deg);
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        circle.appendChild(pin);

        // Store references
        container._rotatingWrapper = rotatingWrapper;

        // Distance info - BELOW the circle, always horizontal
        const distanceText = document.createElement("div");
        const distanceKm = (distance / 1000).toFixed(1);
        distanceText.innerHTML = `${distanceKm}km`;
        distanceText.style.cssText = `
          position: absolute;
          top: 60px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 11px;
          white-space: nowrap;
          color: rgba(0,0,0,0.8);
          font-weight: bold;
          background: rgba(255,255,255,0.9);
          padding: 2px 6px;
          border-radius: 3px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        `;
        container.appendChild(distanceText);

        // Click to smoothly fly to marker
        L.DomEvent.on(container, "click", () => {
          this.map.flyTo([markerData.lat, markerData.lng], 16, {
            duration: 0.8,
            easeLinearity: 0.2,
            noMoveStart: true,
          });
        });

        // Hover effect
        L.DomEvent.on(container, "mouseover", () => {
          rotatingWrapper.style.transform = `rotate(${screenAngle}deg) scale(1.1)`;
        });

        L.DomEvent.on(container, "mouseout", () => {
          rotatingWrapper.style.transform = `rotate(${screenAngle}deg) scale(1)`;
        });

        // Prevent map interactions from container
        L.DomEvent.disableClickPropagation(container);

        return container;
      },
    });

    this.directionIndicator = new DirectionIndicator({ position: "topleft" });
    this.directionIndicator.addTo(this.map);
  }

  calculateBearing(from, to) {
    const lat1 = (from.lat * Math.PI) / 180;
    const lat2 = (to.lat * Math.PI) / 180;
    const dLon = ((to.lng - from.lng) * Math.PI) / 180;

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    const bearing = Math.atan2(y, x) * (180 / Math.PI);
    return (bearing + 360) % 360;
  }
}

// Initialize marker tracker with custom padding
// paddingTop, paddingRight, paddingBottom, paddingLeft - distance from each edge
const tracker = new MarkerTracker(map, {
  paddingTop: 50, // distance from top edge
  paddingRight: 50, // distance from right edge
  paddingBottom: 100, // distance from bottom edge (e.g., for footer)
  paddingLeft: 120, // distance from left edge (e.g., for sidebar)
});

// You can also update padding dynamically:
// tracker.setPadding({ left: 200, bottom: 150 });

// Add some example markers
tracker.addMarker(52.22977, 21.01178, "<b>Marker 1</b><br>Center");
tracker.addMarker(52.23977, 21.01178, "<b>Marker 2</b><br>North");
tracker.addMarker(52.22977, 21.02178, "<b>Marker 3</b><br>East");
tracker.addMarker(52.21977, 21.01178, "<b>Marker 4</b><br>South");
tracker.addMarker(52.22977, 21.00178, "<b>Marker 5</b><br>West");
