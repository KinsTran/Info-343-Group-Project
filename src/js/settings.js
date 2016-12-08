// Code for configuring settings on settings page
"use strict";

var TESTUSER = true; // FOR TESTING PURPOSES TAKE OUT LATER
var currentUser;
var signOutButton = document.getElementById("signOut"); 
var returnButton = document.getElementById("saveAndReturn");
var options = document.getElementById("options");
//var preferences = firebase.database.ref("preferences");

const YELPCATEGORIES = "https://www.yelp.com/developers/documentation/v2/all_category_list/categories.json";

//TEMPORARY HARD CODE, FETCH LATER
var testrestaurants = ["Burgers", "Chinese", "Italian", "COFFEE"]; //FOR TESTING ONLY
//http://stackoverflow.com/questions/45015/safely-turning-a-json-string-into-an-object Forgot all about this to be honest

var restaurants = new Array;

firebase.auth().onAuthStateChanged(function(user){
    if(TESTUSER) { //REMEMBER TO CHANGE BACK TO user
        // console.log(categories);
        currentUser = user;
        categories.forEach(function(place) {
            if(place.parents.includes("restaurants") && (place.country_whitelist && place.country_whitelist.includes("US") || !place.country_whitelist)) {
                restaurants.push(place.title);
                console.log(place);
            }
            // country_whitelist must include "US", parents must include "restaurants"
        })
        renderOptions(restaurants);

    } else { // Redirect to index if navigates to settings without being logged in OR if user logs out
        location = "index.html";
    }
    console.log(restaurants); // REMOVE AFTER DONE DEBUGGING
}) 

signOutButton.addEventListener("click", function() { // Signs out for user if clicked
    firebase.auth().signOut();
})

function renderOptions() { // Added for clarity's sake, instead of just a raw function
    restaurants.forEach(function(type) {
        var button = document.createElement("div");
        button.classList.add("button", "shadow-drama", "default-font");
        button.textContent = type; // CHECK ALL SNAPSHOT RELATED THINGS, PROBABLY DID THEM WRONG
/*        if(snapshot.child(type).val != null) { // If preference already selected in firebase; NEED TO CODE THIS
            button.classList.add("selected");
            button.addEventListener("click", function(event) { // removes from list CODE THIS
                var newObject = new Object; // http://stackoverflow.com/questions/29568979/how-set-key-to-variables-value-using-firebase-javascript
                newObject[type] = null; // ASSUMES Uid is Key FIX IF NOT
                firebase.database().ref("preferences/" + currentUser.uid).update(newObject)
            })
        } else {
                button.addEventListener("click", function(event) { // Adds to list CODE THIS
                    var newObject = new Object;
                    newObject[type] = true;
                    firebase.database().ref("preferences/" + currentUser.uid).update(newObject);
                })
        } */
        options.appendChild(button);
    })
}

preferences.on("value", renderOptions); // Rerendering all buttons for sake of one button changing value