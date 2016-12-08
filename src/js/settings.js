// Code for configuring settings on settings page
"use strict";

var currentUser;
var signOutButton = document.getElementById("signOut"); 
var returnButton = document.getElementById("saveAndReturn");
var options = document.getElementById("options");

var restaurants = new Array;

firebase.auth().onAuthStateChanged(function(user){
    if(user) { 
        currentUser = user;
        categories.forEach(function(place) {
            if(place.parents.includes("restaurants") && (place.country_whitelist && place.country_whitelist.includes("US") || !place.country_whitelist)) {
                restaurants.push(place.title);
            }
            // country_whitelist must include "US", parents must include "restaurants"
        })
    } else { // Redirect to index if navigates to settings without being logged in OR if user logs out
        location = "index.html";
    }
}) 

signOutButton.addEventListener("click", function() { // Signs out for user if clicked
    firebase.auth().signOut();
})

function renderOptions(snapshot) { // Added for clarity's sake, instead of just a raw function
    options.innerHTML = "";
    var userPrefs = userPreferencesRef.child(currentUser.uid).child("prefs");
    console.log("i made it here")
    restaurants.forEach(function(type) {
        var button = document.createElement("div");
        button.classList.add("button", "shadow-drama", "default-font");
        button.textContent = type; // CHECK ALL SNAPSHOT RELATED THINGS, PROBABLY DID THEM WRONG

        var keys = Object.keys(snapshot);

        keys.forEach(function(key) {
            
            if(snapshot[key] == type) {
                button.classList.add("selected");
            }
            
            button.addEventListener("click", function(event) {
                event.preventDefault();

                if (button.classList.contains("selected")) {
                    button.classList.remove("selected");
                    // keys.forEach(function(key) {
                    //     if (userPrefs[key] == type) {
                    //         userPrefs.remove(key);
                    //     }
                    // })
                } else {
                    button.classList.add("selected");
                    userPrefs.push(type);
            }
            
            return false;
            });
        });

        options.appendChild(button);
    })
}

function render(snapshot) {
    snapshot.forEach(renderOptions);
}

userPreferencesRef.on("value", render); // Rerendering all buttons for sake of one button changing value