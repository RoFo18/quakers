// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";
var faultUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  var earthquakedata = data.features 
d3.json(faultUrl, function(data) {
    var faultdata = data.features
createFeatures(earthquakedata, faultdata)
})
});

function createFeatures(earthquakeData, faultdata) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  function FaultFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }


  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });
  var faultlines =L.geoJSON(faultdata, {
      onEachFeature: onEachFeature
  })

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes, faultlines);
}

function createMap(earthquakes, faultlines) {

  // Define streetmap and darkmap layers
 var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/rofo/cjidw3poi1ny72qo0zzop167e/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoicm9mbyIsImEiOiJjamlob3dxYmIxYjVuM3RvY3o0aXZ6a3RzIn0.PuNwTdfKhIk5LvB-5vHDpw")
 var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/rofo/cjiq94r1y3sr72so4mtmr7ygt/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoicm9mbyIsImEiOiJjamlob3dxYmIxYjVuM3RvY3o0aXZ6a3RzIn0.PuNwTdfKhIk5LvB-5vHDpw")
 
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Day Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes last 7 days": earthquakes,
    "Faultlines": faultlines
    
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
