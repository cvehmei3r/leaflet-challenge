// Store our API endpoint as queryUrl. NOTE: This code was taken from 15.1 assignment 10 as a template for the assignment
let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
  });
  function markerColor(coordinates[2]) {
    if coordinates[2] > 90 {
        return "red"; }
    else if coordinates[2] >70 && coordinates[2] <= 90 {
        return "orange";
    }
    else if coordinates[2] >50 && coordinates[2] <= 70 {
        return "gold";
    }
    else if coordinates[2] >30 && coordinates[2] <= 50{
        return "yellow";
    
    }
    else if coordinates[2] >10 && coordinates[2] <= 30 {
        return "lightgreen";

    }
    else if coordinates[2] <= 10 {
        return "green";
    }
    else {
        return "white"
    }

  function markerSizes(mag) {
    return Math.sqrt(mag) *50;
  } }

  let earthquakeMarkers = [];

  for (let i = 0; i < data.length; i++) {
    earthquakeMarkers.push(
        L.circle(data[i].features.geometry.coordinates, {
            stroke: false,
            fillOpacity: 0.75,
            color : markerColor(data[i].features.geometry.coordinates[2]),
            fillColor: markerColor(data[i].features.geometry.coordinates[2]),
            radius: markerSizes(data[i].features.properties.mag)
        })
    );
  }
  function createFeatures(earthquakeData) {
    
    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`Location: <h3>${feature.properties.place} </h3><hr> \
      Time: <b>${new Date(feature.properties.time)} </b><br> \
      Depth: <b>${feature.geometry.coordinates[2]} </b><br> \
      Magnitude: <b>${feature.properties.mag}</b>`);
    }
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 6,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}


