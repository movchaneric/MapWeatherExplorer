let map,
  infoWindow,
  markers = [];

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  //TODO: place a marker on a defualt location
  map = new Map(document.getElementById("map"), {
    center: { lat: 48.8566, lng: 2.3522 },
    zoom: 14,
  });

  // Create an infoWindow object
  infoWindow = new google.maps.InfoWindow();

  // Create location button
  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
  locationButton.id = "locationButton";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton); // set location of the button on the map

  //Place marker on map listener
  google.maps.event.addListener(map, "click", function (event) {
    placeMarker(event.latLng, map);
  });

  locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}

function clearMarkers() {
  // Remove existing markers from the map
  markers.forEach((marker) => {
    marker.setMap(null); //setMap : provided by the Google Maps API
  });
  // Clear the array
  markers = [];
}

function getMarkerCoordinates(markers) {
  let lat, lng;

  if (markers.length > 0) {
    lat = markers[0].getPosition().lat();
    lng = markers[0].getPosition().lng();
    return { lat: lat, lng: lng };
  }
}

function placeMarker(location, map) {
  // Remove existing markers
  clearMarkers();

  // Create a marker and place it on the map
  const marker = new google.maps.Marker({
    position: location,
    map: map,
  });

  markers.push(marker);

  getWeather(markers)
    .then((res) => {
      console.log("getWeather success...");
    })
    .catch((err) => console.log("error in getWeather is placeMarker: ", err));
}

async function getWeather(markers) {
  if (markers === 0) {
    console.log("No marker was assigned...");
    return null;
  }

  //get the coordinates
  const coords = getMarkerCoordinates(markers);

  const weatherQuery = {
    query: `
      query GetCurrentWeather($lat: Float!, $lng: Float!) {
        currentWeather(lat: $lat, lgn: $lng) {
          name
          main {
            temp
            humidity
          }
        }
      }
    `,
    variables: {
      lat: coords.lat,
      lng: coords.lng,
    },
  };

  try {
    const res = await fetch(
      "https://mapweatherexplorer-faa61624a86a.herokuapp.com/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(weatherQuery),
      }
    );

    const resData = await res.json();

    if (resData) {
      //sent resData to ejs file
      document.getElementById("weather-data-city").innerText =
        "City: " + resData.data.currentWeather.name;

      document.getElementById("weather-data-temperature").innerText =
        "Tempreture: " + resData.data.currentWeather.main.temp + " °C";

      document.getElementById("weather-data-humidity").innerText =
        "Humidity: " + resData.data.currentWeather.main.humidity + " %";
      console.log(resData);
    }
  } catch (err) {
    console.log("error fetching weather data: ", err);
    return null;
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

initMap();
