
var map = L.map('map', {
  center: [43.543250939895174, -80.24841781541144],
  minZoom: 2,
  zoom: 12,
})

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: ['a', 'b', 'c'],
}).addTo(map)


// SET COLOUR OF THE DISSEMINATION POLYGONS BASED ON POPULATION
function getColor(d) {
  return d > 3500 ? '#800026' :
         d > 3000  ? '#BD0026' :
         d > 2500  ? '#E31A1C' :
         d > 2000  ? '#FC4E2A' :
         d > 1500   ? '#FD8D3C' :
         d > 1000   ? '#FEB24C' :
         d > 500   ? '#FED976' :
                    '#FFEDA0';
}

function style(feature) {
  return {
      fillColor: getColor(feature.properties.pop_2016),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
  };
}

L.geoJson(daData, {style: style}).addTo(map);


// 


