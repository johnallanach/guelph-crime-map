
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



L.geoJson(parcelsData).addTo(map);


// 
