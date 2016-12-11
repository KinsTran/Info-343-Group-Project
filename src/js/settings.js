// Code for configuring settings on settings page
"use strict";

var currentUser; // Stores information for current User
var currentRef; // Stores reference to current users' preferences
var signOutButton = document.getElementById("signOut"); 
var returnButton = document.getElementById("saveAndReturn");
var options = document.getElementById("options");
var clearPrefs = document.getElementById("clearPrefs");

var restaurants = new Array;

firebase.auth().onAuthStateChanged(function(user){
    if(user) { 
        currentUser = user;
        currentRef = database.ref("settings/" + currentUser.uid);
        categories.forEach(function(place) { // country_whitelist must include "US", parents must include "restaurants"
            if(place.parents.includes("restaurants") && (place.country_whitelist && place.country_whitelist.includes("US") || !place.country_whitelist)) {
                restaurants.push(place.title);
            }

            // Initialize clear preferences button
            clearPrefs.addEventListener("click", function(event) { // http://stackoverflow.com/questions/9334636/javascript-yes-no-alert
                event.preventDefault();
                currentRef.set(null);
            })
        })
    } else { // Redirect to index if someone navigates to settings without being logged in OR if user logs out
        location = "index.html";
    }
}) 

signOutButton.addEventListener("click", function() { // Signs out for user if clicked
    firebase.auth().signOut();
})

function renderOptions(snapshot) { // Added for clarity's sake, instead of just a raw function
    options.innerHTML = ""; // Renders all buttons for user preferences

    restaurants.forEach(function(type) {
        var button = document.createElement("div");
        button.classList.add("button", "shadow-drama", "default-font");
        button.textContent = type;
        if(type == snapshot.child(currentUser.uid).child(type).val()) { // If restuarant type is in database (selected)
            button.classList.add("selected");
        }

        button.addEventListener("click", function(event) {
            event.preventDefault();
            if (button.classList.contains("selected")) { // If the preference is selected, toggle off
                var preferenceType = new Object;
                preferenceType[type] = null;
                currentRef.update(preferenceType); // If preference is not selected, toggle on
            } else { // http://stackoverflow.com/questions/11508463/javascript-set-object-key-by-variable
                var preferenceType = new Object;
                preferenceType[type] = type;
                currentRef.update(preferenceType);
            }
            return false;
        });

        options.appendChild(button);
    })
}

function render(snapshot) {
    renderOptions(snapshot);
}

userSettingsRef.on("value", render); // Rerendering all buttons for sake of one button changing value