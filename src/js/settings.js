// Code for configuring settings on settings page
"use strict";

var TESTUSER = true; // FOR TESTING PURPOSES TAKE OUT LATER
var currentUser;
var signOutButton = document.getElementById("signOut"); // NEEDS TO HAVE SIGNOUT BUTTON
var options = document.getElementById("options");

const YELPCATEGORIES = "https://www.yelp.com/developers/documentation/v2/all_category_list/categories.json";

//TEMPORARY HARD CODE, FETCH LATER
//var tempCategories = require("../../categories.json") // CANNOT GET REQUIRE TO WORK FIX THIS
//var categories = JSON.parse(tempCategories);
var testCategories = ["Burgers", "Chinese", "Italian", "COFFEE"]; //FOR TESTING ONLY
//http://stackoverflow.com/questions/45015/safely-turning-a-json-string-into-an-object Forgot all about this to be honest

var restuarants = new Array;
// country_whitelist must include "US", parents must include "restaurants"


firebase.auth().onAuthStateChanged(function(user){
    if(TESTUSER) { //REMEMBER TO CHANGE BACK TO user
        console.log(categories);
        currentUser = user;
        categories.forEach(function(place) {
            if(place.parents.includes("restuarants") && place.country_whitelist.includes("US")) {
                restuarants.push(place.title);
            }
        })
        renderOptions(testCategories); // Change to categories later

    } else { // Redirect to index if navigates to settings without being logged in OR if user logs out
        location = "index.html";
    }
    console.log(restuarants);
}) 

signOutButton.addEventListener("click", function() { // Signs out for user if clicked
    firebase.auth().signOut();
})

function renderOptions(list) { // Added for clarity's sake
    list.forEach(function(type) {
        var button = document.createElement("div");
        button.classList.add("button", "shadow-drama", "small-button");
        button.textContent = type;
        if(button) { // If preference already selected in firebase, color green
            button.classList.add("selected");
        }
        button.addEventListener("submit", function(event) {
            event.preventDefault();

        })
        options.appendChild(button);
    })

}