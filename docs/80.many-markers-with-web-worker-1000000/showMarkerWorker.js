// importScripts("https://cdn.jsdelivr.net/npm/rbush@3.0.1/rbush.min.js");
importScripts("rbush.min.js");

const tree = new RBush();

self.onmessage = function (e) {
  const { type, data, bounds } = e.data;

  if (type === "init") {
    const items = data.map(({ lat, lng, id }) => ({
      minX: lng,
      minY: lat,
      maxX: lng,
      maxY: lat,
      id,
    }));
    tree.clear();
    tree.load(items);
    self.postMessage({ type: "init-complete", count: items.length });
  }

  if (type === "filter") {
    if (!bounds) {
      self.postMessage({ type: "filter-results", markers: [] });
      return;
    }
    const results = tree.search(bounds);
    self.postMessage({ type: "filter-results", markers: results });
  }
};
