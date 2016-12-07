// Code for configuring settings on settings page
"use strict";

var TESTUSER = true; // FOR TESTING PURPOSES TAKE OUT LATER
var currentUser;
var signOutButton = document.getElementById("signOut"); // NEEDS TO HAVE SIGNOUT BUTTON

const YELPCAT = "https://www.yelp.com/developers/documentation/v2/all_category_list/categories.json";

//TEMPORARY HARD CODE, FETCH LATER
var tempCategories = 
var categories = JSON.parse(tempCategories);
//http://stackoverflow.com/questions/45015/safely-turning-a-json-string-into-an-object Forgot all about this to be honest

var restuarants = new Array;
// country_whitelist must include "US", parents must include "restaurants"


firebase.auth().onAuthStateChanged(function(user){
    if(TESTUSER) {
        currentUser = user;
        categories.forEach(function(place) {
            if(place.parents.includes("restuarants") && place.country_whitelist.includes("US")) {
                restuarants.push(place.title);
            }
        })
    } else {
        location = "index.html"; // Redirect to index if navigates to settings without being logged in
    }
    console.log(restuarants);
}) 

signOutButton.addEventListener("click", function() {
    firebase.auth().signOut();
})