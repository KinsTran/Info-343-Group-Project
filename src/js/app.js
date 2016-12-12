"use strict";

// OpenStreetMap tile server for the map
var osmTiles = {
    url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
};

// gets the div with id="map" which is where the map will go
var mapDiv = document.getElementById("map");
// amount to offset each search by to get more options for restaurants
var offset = 0;
// gets the button with the id="pick" to use for choosing a new restaurant
var pick = document.getElementById("pick");
// gets button with id="sign-out" for signing out of firebase and returning to home
var signout = document.getElementById("sign-out");
// gets button with id="username" for going to user settings
var userButton = document.getElementById("username");
// coordinates of Seattle to use as a backup incase the user denies location permission
var seattleCoords = L.latLng(47.61, -122.33);
var defaultZoom = 14;
// array of all the markers we add to the map
var markers = [];
// all the restaurants returned in our search
var allRestaurants;
// the users' current location if they allow permission
var currentLocation;
// Stores reference to current users' preferences
var currentRef;
// Current user containing UID
var currentUser;
// Current session
var currentSess;
// Retrieved preferences
var currentPreferences;

// Redirects to index if user is not logged in
firebase.auth().onAuthStateChanged(function(user) {
    if(!user) {
        alert("You must be logged in to use bonseye!");
        window.location = "index.html";
    } else {
        currentUser = user;
        currentRef = database.ref("settings/" + currentUser.uid);
        currentSess = database.ref("session/" + currentUser.uid);

        // Listen for changes on preferences
        currentRef.on("value", function(snap) {
            currentPreferences = Object.values(snap.val());
            //If the user has selected a currentRating
            if(snap.val()['currentRating']) {
                currentPreferences = currentPreferences.slice(0, currentPreferences.length - 1);
            }
            //if the user has a maximum distance selected, need to not add the number to fetch url
            if(snap.val()['maxDistance']) {
                currentPreferences = currentPreferences.slice(0, currentPreferences.length - 1);
            }
        });
    }
});



// initializes map with touch events allowed
var map = L.map(mapDiv, {touchZoom: true, dragging: true, tap:true}).setView(seattleCoords, defaultZoom);

L.tileLayer(osmTiles.url, {
    attribution: osmTiles.attribution
}).addTo(map);

// clears all the markers on the map
function clearMarkers() {
    markers.forEach(function(marker) {
        map.removeLayer(marker);
    });
}

// creates a new latlng object and gets the restaurants around the users' current location
// takes an object containing position data
function onPosition(position) {
    var latlng = L.latLng(position.coords.latitude, position.coords.longitude);
    getRestaurants(latlng);
}

// if there is an error with the users location then it reports it to the user and picks a restaurant in Seattle
// takes an error to tell the user
function onPositionError(error) {
    console.error(error);
    alert(err.message);
    getRestaurants(seattleCoords);
}

// asks the user to be allouw use of their current location to find restaurants, if they dont allow permission then
// choose a restaurant in the Seattle area
if (navigator && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onPosition, onPositionError,
        {enableHighAccuracy: true});
} else {
    getRestaurants(seattleCoords);
}

pick.addEventListener("click", function() {
        clearMarkers();
        getRestaurants(currentLocation);
});

signout.addEventListener("click", function() {
    firebase.auth().signOut()
    .then(function() {
        window.location = "login.html";
    })
    .catch(function(error) {
        console.log(error.message);
    });
});

userButton.addEventListener("click", function() {
    window.location = "settings.html";
});

// Shortcut for choosing new restaurant
// http://stackoverflow.com/questions/16089421/simplest-way-to-detect-keypresses-in-javascript
window.onkeypress = function(e) {
    e = e || window.event;
    if(e.keyCode == 32) {
        clearMarkers();
        if(currentLocation) {
            getRestaurants(currentLocation);
        }
    }
};

// creates a marker of the users' current location
function createMarker() {
    var marker = L.marker(currentLocation).addTo(map);
    markers.push(marker);
}

// creates markers for the users' location and the restaurant that was picked
function chooseRestaurant() {
    createMarker();

    // http://www.javascriptkit.com/javatutors/randomnum.shtml
    var rand = Math.floor(Math.random()*20);
    var restaurant = allRestaurants.businesses[rand];

    var restaurantLocation = L.latLng(restaurant.location.coordinate.latitude, restaurant.location.coordinate.longitude);

    var blatlng = L.latLng(restaurantLocation.lat, restaurantLocation.lng);
    var marker = L.circleMarker(blatlng).addTo(map);
    markers.push(marker);

    var divPopup = document.createElement("div");
    divPopup.className = "pop-up"
    var h2 = divPopup.appendChild(document.createElement("h2"));
    h2.textContent = restaurant.name;
    var img = divPopup.appendChild(document.createElement("img"));
    img.src = restaurant.rating_img_url;
    img.alt = "rating is " + restaurant.rating + " stars";

    divPopup.appendChild(document.createElement("br"));

    var imgPrev = divPopup.appendChild(document.createElement("img"));
    imgPrev.src = restaurant.image_url;
    imgPrev.alt = "preview image of " + restaurant.name;

    divPopup.appendChild(document.createElement("br"));

    var phone = divPopup.appendChild(document.createElement("a"));
    phone.href = "tel:" + restaurant.phone;
    phone.textContent = restaurant.display_phone;

    divPopup.appendChild(document.createElement("br"));

    var address = divPopup.appendChild(document.createElement("p"));
    address.textContent = restaurant.location.display_address;

    marker.bindPopup(divPopup).openPopup();
}

// fetches restaurants that are close the the passed in coordinates and plots them on the map
// takes an object with latitude and longitude properties
function getRestaurants(latlng) {

    currentLocation = latlng;
    createMarker();
    map.panTo(latlng);

    var url = "/api/v1/search";
    url += "?lat=" + latlng.lat;
    url += "&lng=" + latlng.lng;
    url += "&offset=" + offset * 3;
    //check to see if there are food categories
    if(currentPreferences && currentPreferences.length > 0) {
        url += "&category_filter=";
        for(var i = 0; i < currentPreferences.length - 1; i++) {
            url += currentPreferences[i] + ",";
        }
        url += currentPreferences[i]; //last element without comma
    }
    offset++;
    console.log(url);
    console.log("fetching", url);
    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log("data:", data);
            allRestaurants = data;
            chooseRestaurant();
        })
        .catch(function(error) {
            console.error(error);
        });
}
