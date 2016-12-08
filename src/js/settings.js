// Code for configuring settings on settings page
"use strict";

var TESTUSER = true; // FOR TESTING PURPOSES TAKE OUT LATER
var currentUser;
var signOutButton = document.getElementById("signOut"); 
var returnButton = document.getElementById("saveAndReturn");
var options = document.getElementById("options");
var preferences = firebase.database.ref("preferences");

const YELPCATEGORIES = "https://www.yelp.com/developers/documentation/v2/all_category_list/categories.json";

//TEMPORARY HARD CODE, FETCH LATER
var tempCategories = require("../../categories.json") // CANNOT GET REQUIRE TO WORK FIX THIS
var categories = JSON.parse(tempCategories);
var testRestuarants = ["Burgers", "Chinese", "Italian", "COFFEE"]; //FOR TESTING ONLY
//http://stackoverflow.com/questions/45015/safely-turning-a-json-string-into-an-object Forgot all about this to be honest

var restuarants = new Array;

firebase.auth().onAuthStateChanged(function(user){
    if(TESTUSER) { //REMEMBER TO CHANGE BACK TO user
        console.log(categories);
        currentUser = user;
        categories.forEach(function(place) {
            if(place.parents.includes("restuarants") && place.country_whitelist.includes("US")) {
                restuarants.push(place.title);
            }// country_whitelist must include "US", parents must include "restaurants"
        })
        renderOptions(restuarants);

    } else { // Redirect to index if navigates to settings without being logged in OR if user logs out
        location = "index.html";
    }
    console.log(restuarants); // REMOVE AFTER DONE DEBUGGING
}) 

signOutButton.addEventListener("click", function() { // Signs out for user if clicked
    firebase.auth().signOut();
})

function renderOptions(snapshot) { // Added for clarity's sake, instead of just a raw function
    restaurants.forEach(function(type) {
        var button = document.createElement("div");
        button.classList.add("button", "shadow-drama", "small-button");
        button.textContent = type; // CHECK ALL SNAPSHOT RELATED THINGS, PROBABLY DID THEM WRONG
        if(snapshot.child(type).val != null) { // If preference already selected in firebase; NEED TO CODE THIS
            button.classList.add("selected");
            button.addEventListener("click", function(event) { // removes from list CODE THIS
                firebase.database().ref("preferences/").update({ // Assumes uid is key FIX IF NOT
                    
                })// https://firebase.google.com/docs/reference/js/firebase.database.Reference#update
            }) // UPdate vs Transaction
        } else {
                button.addEventListener("click", function(event) { // Adds to list CODE THIS
                    firebase.database().ref("preferences/" + currentUser.uid).update({ // Assumes uid is key FIX IF NOT
                        
                    })
                })
        }
        options.appendChild(button);
    })
}

preferences.on("value", renderOptions); // Rerendering all buttons for sake of one button changing value