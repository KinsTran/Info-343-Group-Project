// Code for configuring settings on settings page
"use strict";

var currentUser; // Stores information for current User
var currentRef; // Stores reference to current users' preferences
var signOutButton = document.getElementById("signOut");  // References to various buttons on settings page
var returnButton = document.getElementById("doneSetting");
var options = document.getElementById("options");
var clearPrefs = document.getElementById("clearPrefs");
var ratings = document.getElementsByName("rating"); // http://www.w3schools.com/jsref/met_doc_getelementsbyname.asp I was about to call every one by an id too

var restaurants = new Array;
var restaurantsAlias = new Object;

firebase.auth().onAuthStateChanged(function(user){
    if(user) {
        currentUser = user;
        currentRef = database.ref("settings/" + currentUser.uid);
        categories.forEach(function(place) { // country_whitelist must include "US", parents must include "restaurants"
            if(place.parents.includes("restaurants") && (place.country_whitelist && place.country_whitelist.includes("US") || !place.country_whitelist)) {
                restaurants.push(place.title);
                restaurantsAlias[place.title] = place.alias;
            }
            // Initialize clear preferences button
            clearPrefs.addEventListener("click", function(event) { // http://stackoverflow.com/questions/9334636/javascript-yes-no-alert
                event.preventDefault();
                currentRef.set(null);
            })
        });
        for(let i = 0; i < ratings.length; i++) { // Adds event listeners to each button
            ratings[i].addEventListener("click", function() {
                var currentRating = new Object;
                currentRating["currentRating"] = ratings[i].value;
                currentRef.update(currentRating);
            })
        }
    } else { // Redirect to index if someone navigates to settings without being logged in OR if user logs out
        alert("You must be logged in to use bonseye!");
        location = "login.html";
    }
});

signOutButton.addEventListener("click", function() { // Signs out for user if clicked
    firebase.auth().signOut();
});

returnButton.addEventListener("click", function() {
    window.location = "app.html";
})

function renderOptions(snapshot) { // Added for clarity's sake, instead of just a raw function
    options.innerHTML = ""; // Renders options for users to set preferences

    restaurants.forEach(function(type) {// Renders all buttons for restaurant types
        var button = document.createElement("div");
        button.classList.add("button", "shadow-drama", "default-font");
        button.textContent = type;
        if(snapshot.child(currentUser.uid).child(type).val()) { // If restuarant type is not null (selected)
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
                preferenceType[type] = restaurantsAlias[type];
                currentRef.update(preferenceType);
            }
            return false;
        });

        options.appendChild(button);
    })

    for(let i = 0; i < ratings.length; i++) { // Check off button if it is the "current" rating. Must be done here,
        if(ratings[i].value == snapshot.child(currentUser.uid).child("currentRating").val()) {// since snapshot is only accessable in this function
            ratings[i].checked = true;
        } else { // Explicitly uncheck if button is not "current" rating. Useful for clearing preferences
            ratings[i].checked = false;
        }
    }
}

userSettingsRef.on("value", renderOptions); // Rerendering all buttons for sake of one button changing value
