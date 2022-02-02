/* Set up the initial map center and zoom level */
var map = L.map('map', {
center: [43.533250939895174, -80.23841781541144], // EDIT coordinates to re-center map
zoom: 12.5,  // EDIT from 1 (zoomed out) to 18 (zoomed in)
scrollWheelZoom: true,
tap: false
});

/* display basemap tiles -- see others at https://leaflet-extras.github.io/leaflet-providers/preview/ */
L.tileLayer(
'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">\
    OpenStreetMap</a> contributors, &copy;\
    <a href="https://carto.com/attribution">CARTO</a>',
    //minZoom: 12
}).addTo(map);

/* define streets variable */
var streets;

/* function to change street style based on attribute */
function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
    return {
        weight: 2,
        opacity: 0.65,
        color: getColor(feature.properties.ATTRIBUTE)
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
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

var myStyle = {
    "color": "#666",
    "weight": 5,
    "opacity": 0
};

streets = L.geoJSON(streets, {
    style: myStyle,
    onEachFeature: onEachFeature
}).addTo(map);

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>---------- Guelph Crime ----------</h4>' +  (props ?
        '<b>' + props.STREET + '</b><br />' + props.ATTRIBUTE + ' incidents per year</sup>'
        : '');
};

info.addTo(map);
