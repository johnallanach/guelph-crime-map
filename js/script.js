// config map
let config = {
  minZoom: 12,
  maxZoom: 18,
};
// start magnification
const zoom_init = 12.5;
// start co-ordinates
const lat = 43.53;
const lng = -80.24;

// call map
const map = L.map("map", config).setView([lat, lng], zoom_init);

// load and display tile layers on the map
// preview others at https://leaflet-extras.github.io/leaflet-providers/preview/
L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://osm.org/copyright">\
      OpenStreetMap</a> contributors, &copy;\
      <a href="https://carto.com/attribution">CARTO</a>',
      minZoom: 12
  }).addTo(map);


// define streets variable
var streets;

// add geojson by fetch
fetch("data/gps.geojson")
.then(function (response) {
  return response.json();
})
.then(function (data) {
  // use geoJSON
  streets = L.geoJSON(data, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);
});

// set street colour based on attribute
function getColour(d) {
  return d > 1.730  ? '#d7191c' :
         d > 0.5910   ? '#fdae61' :
         d > 0.2950   ? '#ffffbf' :
         d > 0.1546   ? '#abdda4' :
                    '#2b83ba';
}

function style(feature) {
  return {
      weight: 3,
      opacity: 1,
      color: getColour(feature.properties.CALL_RATE)
  };
}

// listener function for highlighting mouse-over streets
function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
      weight: 3,
      color: '#00FFFF',
      dashArray: '',
      fillOpacity: 1
  });

  info.update(layer.feature.properties);

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
  }
}

function resetHighlight(e) {
  streets.resetStyle(e.target);
  info.update();
}

// zoom to clicked street
function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
  });
}

// info box to display stats about hovered-over streets 
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = (props ?
        '<b>' + props.LABEL + '</b><br />' + 
        'Total incidents: ' + props.TOTAL + '<br />' + 
        'Incidents in 2020: ' + props.TWENTY + '<br />' +
        'Incidents in 2019: ' + props.NINETEEN + '<br />' +
        'Incidents in 2018: ' + props.EIGHTEEN + '<br />' +
        'Incidents in 2017: ' + props.SEVENTEEN + '<br />' +
        'Incidents in 2016: ' + props.SIXTEEN + '<br />' +
        'Incidents in 2015: ' + props.FIFTEEN + '<br />' +
        'Incidents in 2014: ' + props.FOURTEEN
        : 'Hover over a street to display crime stats');
}; 

info.addTo(map);

// legend
const legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
  let div = L.DomUtil.create("div", "description");
  L.DomEvent.disableClickPropagation(div);
  const text =
    "<b>Guelph Crime Map</b><br /> Data obtained from Guelph Police Service’s law " + 
    "enforcement occurrence data on calls for service in the City of Guelph from " +
    "2014 to 2020.";
  div.insertAdjacentHTML("beforeend", text);
  return div;
};

legend.addTo(map);