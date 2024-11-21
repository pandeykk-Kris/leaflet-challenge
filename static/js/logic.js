// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features array to the createMarkers function.
  createMarkers(data.features);

  // Log the features to the console to inspect them
  console.log(data.features);
});

    // Create the tile layer that will be the background of the map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    // Create the map over Kansas City, Missouri
    let map = L.map("map", {
      center: [39.13880763143057, -94.42670323824478],
      zoom: 5,
    });
    streetmap.addTo(map)
  
// Create a function to create the markers earthquake data
    function createMarkers(data) {
  
//'color scheme for the depth of the earthquake

function getValue(x) {
  return x > 90 ? "red" :
         x > 70 ? "purple" :
         x > 50 ? "orange" :
         x > 30 ? "yellow" :
         x > 10 ? "magenta" :
             "lime";
}

// Create a function to style the markers. the radius is based on magnitude and fill color based on depth.
function style(feature) {
  return {
      "color": "black",
      "stroke": true,
      radius: feature.properties.mag*4,
fillColor: getValue(feature.geometry.coordinates[2]),
weight: 0.25,
opacity: 0.75,
fillOpacity: 0.5
  };
}
// geoJSON layer creation from geometry and coordinates
var dat = L.geoJson(data, {
  pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, style(feature));
  },
        
  onEachFeature: function(feature, layer) {
      layer.bindPopup("<strong>" + feature.properties.place + "</strong><br /><br />Magnitude: " +
        feature.properties.mag + "<br /><br />Depth: " + feature.geometry.coordinates[2]);
    }
});
dat.addTo(map);

//Legend Creation
let legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend");
  let limits = [-10, 10, 30, 50, 70, 90];
  let colors = ['lime', 'magenta', 'yellow', 'orange', 'purple', 'red'];
  
  for (let i = 0; i < limits.length; i++) {
    // Check if there is a next limit to avoid accessing out of bounds
    div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
      + limits[i] + (i < limits.length - 1 ? "&ndash;" + limits[i + 1] + "<br>" : "+");
  }
  
  return div;
};

// Adding the legend to the map
legend.addTo(map);
  }