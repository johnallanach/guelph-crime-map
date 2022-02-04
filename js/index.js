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
    minZoom: 12
}).addTo(map);

/* define streets variable */
var streets;


streets = L.geoJSON(streets, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);



/* function to change street style based on attribute */
function getColor(d) {
    return d > 1636  ? '#d7191c' :
           d > 409   ? '#fdae61' :
           d > 161   ? '#ffffbf' :
           d > 69   ? '#abdda4' :
                      '#2b83ba';
}

function style(feature) {
    return {
        weight: 3,
        opacity: 0.65,
        color: getColor(feature.properties.TOTAL)
    };
}

/*listener function for highlighting mouse-over streets */
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




var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method to update control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>-------------- Guelph Crime --------------</h4>' +  (props ?
        '<b>' + props.LABEL + '</b><br />' + props.TOTAL + ' total incidents (2014-2020)</sup>'
        : '');
};

info.addTo(map);

