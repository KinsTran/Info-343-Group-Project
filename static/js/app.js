"use strict";


var osmTiles = {
    url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
};

var mapDiv = document.getElementById("map");
var seattleCoords = L.latLng(47.61, -122.33);
var defaultZoom = 14;

var markers = [];

var map = L.map(mapDiv).setView(seattleCoords, defaultZoom);
L.tileLayer(osmTiles.url, {
    attribution: osmTiles.attribution
}).addTo(map);

function clearMarkers() {
    markers.forEach(function(marker) {
        map.removeLayer(marker);
    });
}

/**
 * onPosition() is called after a successful geolocation 
 * @param {object} position geolocation position data
 */
function onPosition(position) {
    var latlng = L.latLng(position.coords.latitude, position.coords.longitude);
    getRestaurants(latlng);
}

/**
 * onPositionError() is called after a geolocation error
 * @param {Error} err the error 
 */
function onPositionError(err) {
    console.error(err);
    alert(err.message);
    getRestaurants(seattleCoords);
}

if (navigator && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onPosition, onPositionError, 
        {enableHighAccuracy: true});
} else {
    getRestaurants(seattleCoords);
}

map.addEventListener("click", function(event) {
    clearMarkers();
    getRestaurants(event.latlng);
});

function chooseRestaurant(data) {
    // http://www.javascriptkit.com/javatutors/randomnum.shtml
    var rand = Math.floor(Math.random()*20);

    var restaurant = data.businesses[rand];
    var blatlng = L.latLng(restaurant.location.coordinate.latitude, restaurant.location.coordinate.longitude);
    var marker = L.circleMarker(blatlng).addTo(map);
    markers.push(marker);

    var divPopup = document.createElement("div");
    var h2 = divPopup.appendChild(document.createElement("h2"));
    h2.textContent = restaurant.name;
    var img = divPopup.appendChild(document.createElement("img"));
    img.src = restaurant.rating_img_url;
    img.alt = "rating is " + restaurant.rating + " stars";

    var imgPrev = divPopup.appendChild(document.createElement("img"));
    imgPrev.src = restaurant.image_url;
    imgPrev.alt = "preview image of " + restaurant.name;

    marker.bindPopup(divPopup);
}

/**
 * getRestaurants() fetches the nearby bars from our server
 * and plots them on the map
 * @param {object} latlng Leaflet.js LatLng object
 * @param {number} latlng.lat the latitude
 * @param {number} latlng.lng the longitude
 */
function getRestaurants(latlng) {
    var marker = L.marker(latlng).addTo(map);
    markers.push(marker);
    map.panTo(latlng);

    var url = "/api/v1/search";
    url += "?lat=" + latlng.lat;
    url += "&lng=" + latlng.lng;
    console.log("fetching", url); 
    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            chooseRestaurant(data);
        })
        .catch(function(err) {
            console.error(err);
        });
} 

// move chooseRestaurant to eventListener on a button outside of getRestaurants
// maybe add change location button and attatch to map listener
// add state object that has data and user stored to be able to use globaly
// store the array of restuarants as a global to query later
// add address and phone number to pop up