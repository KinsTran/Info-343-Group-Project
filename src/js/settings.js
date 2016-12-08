// Code for configuring settings on settings page
"use strict";

var currentUser;
var signOutButton = document.getElementById("signOut"); // NEEDS TO HAVE SIGNOUT BUTTON

firebase.auth().onAuthStateChanged(function(user){
    if(user) {
        currentUser = user;
    } else {
        location = "index.html"; // Redirect to index if navigates to settings without being logged in
    }
})

signOutButton.addEventListener("click", function() {
    firebase.auth().signOut();
})

// https://github.com/KinsTran/info343-in-class/blob/master/node/server.js for yelp api stuff