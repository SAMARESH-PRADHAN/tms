document.addEventListener("DOMContentLoaded", function () {
  // Load header
  fetch("nav.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("headerHome").innerHTML = data;
    });

  // Load footer
  fetch("footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("footer").innerHTML = data;
    });

  // Set header background to none
  document.getElementById("headerHome").style.background = "none";
  // document.getElementById("footer").style.background = "none";
});

// Initialize OpenLayers Map
var mapView = new ol.View({
  center: ol.proj.fromLonLat([78.96288, 20.593684]),
  zoom: 7,
});

var map = new ol.Map({
  target: "map",
  view: mapView,
});

var osmTile = new ol.layer.Tile({
  title: "Open Street Map",
  visible: true,
  source: new ol.source.OSM(),
});

map.addLayer(osmTile);

var IndiaTile = new ol.layer.Tile({
  title: "India",
  source: new ol.source.TileWMS({
    url: "http://localhost:8080/geoserver/tms/wms",
    params: { LAYERS: "tms:bdr", TILED: true },
    serverType: "geoserver",
  }),
  visible: false,
});

map.addLayer(IndiaTile);

var StateTile = new ol.layer.Tile({
  title: "India States",
  source: new ol.source.TileWMS({
    url: "http://localhost:8080/geoserver/tms/wms",
    params: { LAYERS: "tms:india_bdr", TILED: true },
    serverType: "geoserver",
  }),
  visible: false,
});

map.addLayer(StateTile);

//  Function to toggle layer visibility
function toggleLayer(layer) {
  layer.setVisible(!layer.getVisible());
}

// Add vector layer for state search marker
var vectorSource = new ol.source.Vector();
var vectorLayer = new ol.layer.Vector({
  source: vectorSource,
});
map.addLayer(vectorLayer);

// Function to Search for State
function searchState() {
  var stateName = document.getElementById("search-box").value.trim();

  if (!stateName) {
    alert("Please enter a state name.");
    return;
  }

  var apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${stateName},India`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        var state = data[0];
        var lon = parseFloat(state.lon);
        var lat = parseFloat(state.lat);
        var coordinates = ol.proj.fromLonLat([lon, lat]);

        mapView.animate({
          center: coordinates,
          zoom: 10,
          duration: 1000,
        });

        vectorSource.clear(); // Remove existing markers

        var marker = new ol.Feature({
          geometry: new ol.geom.Point(coordinates),
        });

        marker.setStyle(
          new ol.style.Style({
            image: new ol.style.Icon({
              anchor: [0.5, 1],
              src: "./assets2/marker.png",
              scale: 0.02, // Adjust marker size
            }),
          })
        );

        vectorSource.addFeature(marker);
      } else {
        alert("State not found. Try a different name.");
      }
    })
    .catch((error) => console.error("Error fetching location:", error));
}

// Define location marker style
var iconStyle = new ol.style.Style({
  image: new ol.style.Icon({
    anchor: [0.5, 1],
    src: "./assets2/image/location-map-marker.png", // Ensure you have a proper icon in assets2
    scale: 0.03,
  }),
});

// Create popup container
var popupContainer = document.createElement("div");
popupContainer.id = "popup";
popupContainer.classList.add("popup-box");
document.body.appendChild(popupContainer);

var popupOverlay = new ol.Overlay({
  element: popupContainer,
  positioning: "bottom-center",
  stopEvent: false,
});
map.addOverlay(popupOverlay);

let destinationLayer; // global variable
let destinationsVisible = false;

// Load destinations from API
fetch("https://tms-backend-kfut.onrender.com/destinationss")
  .then((response) => response.json())
  .then((data) => {
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error("Invalid data format received from API");
    }

    var features = data.data.map((place) => {
      var feature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat(place.coords)),
        destination_id: place.destination_id,
        name: place.name,
        package_count: place.package_count,
      });

      feature.setStyle(iconStyle);
      return feature;
    });

    var vectorSource = new ol.source.Vector({ features: features });

    destinationLayer = new ol.layer.Vector({
      source: vectorSource,
      visible: false, // initially hidden
    });

    map.addLayer(destinationLayer);

    // Handle click on destination point
    map.on("singleclick", function (evt) {
      var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
      });

      if (feature) {
        var coordinates = feature.getGeometry().getCoordinates();
        var destinationId = feature.get("destination_id");
        var placeName = feature.get("name");
        var packageCount = feature.get("package_count");

        fetch(`https://tms-backend-kfut.onrender.com/packagess/${destinationId}`)
          .then((response) => response.json())
          .then((data) => {
            if (!data.data || !Array.isArray(data.data)) {
              console.error("Invalid data format received from API", data);
              popupContainer.innerHTML =
                "<p>Error fetching packages. Try again later.</p>";
              return;
            }

            let packageList = "<h3>Select a Package</h3>";

            if (data.data.length > 0) {
              data.data.forEach((pkg) => {
                packageList += `
                  <button class="package-btn" data-package='${JSON.stringify(
                    pkg
                  )}'>
                    ${pkg.package_name}
                  </button>`;
              });
            } else {
              packageList += "<p>No packages available.</p>";
            }
            popupContainer.innerHTML = `
              <div class="package-container">
                <h2>${placeName}</h2>${packageList}
              </div>
            `;
            popupOverlay.setPosition(coordinates);
            popupContainer.style.display = "block";

            document.querySelectorAll(".package-btn").forEach((btn) => {
              btn.addEventListener("click", function () {
                let packageData = JSON.parse(this.getAttribute("data-package"));
                showPackageDetails(packageData);
              });
            });
          })
          .catch((error) => console.error("Error fetching packages:", error));
      } else {
        popupContainer.style.display = "none";
      }
    });
  })
  .catch((error) => console.error("Error fetching destinations:", error));

// Function to show package details in the popup
function showPackageDetails(pkg) {
  let imageUrl = pkg.image ? pkg.image : "../image/default-image.png"; // Use default if missing

  let detailsContainer = document.getElementById("package-details-content");

  if (!detailsContainer) {
    console.error("Package details container not found.");
    return;
  }

  detailsContainer.innerHTML = `
      <h3>${pkg.package_name}</h3>
      <img src="${imageUrl}" alt="Package Image">
      <p><strong>Description:</strong> ${pkg.description}</p>
      <p><strong>Price:</strong> ₹${pkg.price}</p>
      <p><strong>Duration:</strong> ${pkg.duration} days</p>
    
      <a href="booking.html?package_id=${pkg.package_id}" class="book-now-btn">Book Now</a>
  `;

  document.getElementById("package-details-popup").style.display = "block";
}

// Function to close package details popup
function closePackagePopup() {
  document.getElementById("package-details-popup").style.display = "none";
}
function toggleDestinations() {
  destinationsVisible = !destinationsVisible;
  destinationLayer.setVisible(destinationsVisible);
  const btn = document.getElementById("toggle-destination-btn");
  btn.textContent = destinationsVisible
    ? "Hide Destinations"
    : "Show Destinations";
}
