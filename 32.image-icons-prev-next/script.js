/**
 * Image icons prev/next
 */

// config map
let config = {
  minZoom: 7,
  maxZomm: 18,
};
// magnification with which the map will start
const zoom = 17;
// coordinates
const lat = 52.2294;
const lon = 21.010;

// coordinate array with popup text
const points = [
  {
    'lat': 52.228785157729114,
    'lng': 21.006867885589603,
    'title': 'Lviv',
    'image': 'https://grzegorztomicki.pl/images/lwow/576/IMG_0202.jpg"'
  },
  {
    'lat': 52.22923201880194,
    'lng': 21.00897073745728,
    'title': 'China',
    'image': 'https://grzegorztomicki.pl/images/chiny/576/IMG_8413.jpg'
  },
  {
    'lat': 52.22963944703663,
    'lng': 21.01091265678406,
    'title': 'Morocco',
    'image': 'https://grzegorztomicki.pl/images/maroko/576/IMG_0738.jpg'
  },
  {
    'lat': 52.229928587386496,
    'lng': 21.01218938827515,
    'title': 'Israel',
    'image': 'https://grzegorztomicki.pl/images/izrael/576/IMG_2071.jpg'
  }
];

// calling map
const map = L.map('map', config).setView([lat, lon], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// we create an array of markers
// each marker has a unique title
// of course this could be another parameter
const featureGroups = [];
for (let i = 0; i < points.length; i++) {
  const { lat, lng, title, image } = points[i];
  const myIcon = L.divIcon({
    className: 'image-icon',
    html: `<div style='border: 4px solid #fff; box-shadow: 0 0 10px rgba(0,0,0,.4);'><img src="${image}" style="display: block; width: 100%; height: auto;"></div>`,
    iconSize: new L.Point(100, 50),
    iconAnchor: [50, 50],
    popupAnchor: [0, -40]
  });

  const marker = L.marker([lat, lng], { title: title, icon: myIcon });

  featureGroups.push(marker.bindPopup(title).on('click', centerOnMarker));
}

// we add markers to the map
for (let i = 0; i < featureGroups.length; i++) {
  featureGroups[i].addTo(map);
}

// function that opens a popup with text at the marker
// and transfers latLng coordinates of the opened marker
// to the centering function
function markerOpen(id) {
  // console.log(id);
  for (let i in featureGroups) {
    const markerId = featureGroups[i].options.title;
    if (markerId === id) {
      featureGroups[i].openPopup();
      centerMarker(featureGroups[i].getLatLng());
    }
  }
}

// function centering the map on the marker
function centerMarker(latlng) {
  const marker = L.marker([latlng.lat, latlng.lng]);
  let group = new L.featureGroup([marker]);
  map.fitBounds(group.getBounds());
}

// center on marker when click
function centerOnMarker(e) {
  const el = e.target.options.title;

  const element = document.getElementById(el);
  removeActiveMenu(element);

  const indexActivePopup = points.findIndex(x => x.title === el);

  activeControls(indexActivePopup)

  map.setView(e.target.getLatLng(), zoom);
}

// active bottom menu
function activeControls(index) {
  if (index === countMarker) {
    next.classList.add('disabled');
    prev.classList.remove('disabled');
  } else if (index > 0 && index < countMarker) {
    next.classList.remove('disabled');
    prev.classList.remove('disabled');
  } else if (index === 0) {
    prev.classList.add('disabled');
    next.classList.remove('disabled');
  }
}

// remove active menu
function removeActiveMenu(element) {
  const curentActive = document.querySelector('.active');
  if (curentActive) {
    curentActive.classList.remove('active');
  }
  element.classList.add('active')
}

const markersDiv = document.querySelectorAll('.marker-click');
const buttonControls = document.querySelectorAll('.button-controls');
const disabled = document.querySelector('.disabled');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const countMarker = markersDiv.length - 1;

// all marker-click classes from html
markersDiv.forEach((marker, index) => {
  marker.addEventListener('click', (e) => {

    const element = e.target;

    // remove active menu
    removeActiveMenu(e.target);

    // active pre
    activeControls(index);

    // the click event transfers to the function
    // id = title of the marker
    markerOpen(marker.id);
  });
});

// click on prev, next
buttonControls.forEach(button => {
  button.addEventListener('click', (e) => {
    const btn = e.target.classList[1];

    let index = Array.from(markersDiv).findIndex(x => x.classList.contains('active'));

    index = btn === 'prev'
      ? index - 1
      : index + 1

    const element = Array.from(markersDiv)[index];
    removeActiveMenu(element);

    markerOpen(element.id);
    activeControls(index);
  })
})