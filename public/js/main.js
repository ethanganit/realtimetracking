$(function () {

//Base Layer with Open Street Maps
var baseMapLayer = new ol.layer.Tile({
  source: new ol.source.OSM()

});

//Construct the Map Object
var map = new ol.Map({
  target: 'map',
  layers: [ baseMapLayer],
  view: new ol.View({
          center: ol.proj.fromLonLat([80.2459,12.9860]),
          zoom: 15 //Initial Zoom Level
        })
});

//Set up an  Style for the marker note the image used for marker
var iconStyle = new ol.style.Style({
    image: new ol.style.Icon(/** @type {module:ol/style/Icon~Options} */ ({
      anchor: [0.5, 16],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      src: 'image/icon.png'
    }))
});


//Adding a marker on the map
var marker = new ol.Feature({
  geometry: new ol.geom.Point(
    ol.proj.fromLonLat([80.24586,12.9859])
  )
});

marker.setStyle(iconStyle);

var vectorSource = new ol.source.Vector({
  features: [marker]
});


var markerVectorLayer = new ol.layer.Vector({
  source: vectorSource,

});

// add style to Vector layer style map
map.addLayer(markerVectorLayer);

marker.setId(markercount);
markercount++;

    function updateCoordinate(item) {
        var featureToUpdate = marker;
        var coord = ol.proj.fromLonLat([
        parseFloat(item.Coordinate.Longitude),
        parseFloat(item.Coordinate.Latitude)]);
        featureToUpdate.getGeometry().setCoordinates(coord);
        console.log(coord);
     }

    // test
    const socket = io({
      transports: ['websocket']
    });

    socket.on('locationUpdate', function (data) {
        console.log("received via websocket :: "  + JSON.stringify(data));
        var item = JSON.parse(data);
        updateCoordinate(item);
    });

});