var event;
navigator.geolocation.getCurrentPosition(function (position) {
  console.log(position);
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let accuracy = position.coords.accuracy;
  console.log(`https://www.google.co.in/maps/@ ${latitude},${longitude},8z`);
  console.log(latitude);
  console.log(longitude);
  console.log(accuracy);
  const coord = [latitude, longitude];

  const map = L.map("map").setView(coord, 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Search button
  L.Control.geocoder().addTo(map);

  //OSM LAYER
  const osm = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );
  //osm.addTo(map);

  // Water color layer
  var Watercolor = L.tileLayer(
    "https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}",
    {
      attribution:
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: "abcd",
      minZoom: 1,
      maxZoom: 16,
      ext: "jpg",
    }
  );
  // Watercolor.addTo(map);

  // WorldStreet Map
  var WorldStreetMap = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
    }
  );
  WorldStreetMap.addTo(map);

  // Google Street map
  var googleStreets = L.tileLayer(
    "http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}",
    {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }
  );
  googleStreets.addTo(map);
  // Google satellite map
  var googleSat = L.tileLayer(
    "http://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}",
    {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }
  );
  // googleSat.addTo(map);

  var myIcon = L.icon({
    iconUrl: "icon.png",
    iconSize: [50, 50],
    iconAnchor: [25, 32],
  });

  var marker = L.marker(coord, { icon: myIcon });
  var circle = L.circle(coord, { radius: accuracy });
  var featureGroup = L.featureGroup([marker, circle]).addTo(map);

  // Layer Controller
  var baseMaps = {
    "OpenStreet Map": osm,
    "WaterColor Map": Watercolor,
    "WorldStreet Map": WorldStreetMap,
    "GoogleStreet Map": googleStreets,
    "GoogleSatellite Map": googleSat,
  };

  var overlayMaps = {
    Marker: marker,
  };
  var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

  map.on("click", function (e) {
    var secondMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
    //ROUTING
    L.Routing.control({
      waypoints: [L.latLng(coord), L.latLng(e.latlng.lat, e.latlng.lng)],
      showAlternatives: true,
      altLineOptions: {
        styles: [
          { color: "black", opacity: 0.15, weight: 9 },
          { color: "blue", opacity: 0.8, weight: 4 },
          { color: "green", opacity: 0.3, weight: 2 },
        ],
      },
      geocoder: L.Control.Geocoder.nominatim(),
    })
      .on("routesfound", function (e) {
        console.log(e);
        e.routes[0].coordinates.forEach(function (coord, index) {
          setTimeout(() => {
            marker.setLatLng([coord.lat, coord.lng]);
          }, 20 * index);
        });
      })
      .addTo(map);
  });
});
