"use strict";

var config = {
    apiKey: "AIzaSyBRPSduRq2PsdIuXrLdBNl1RYU0lhYQMWE",
    authDomain: "bonseye-56d35.firebaseapp.com",
    databaseURL: "https://bonseye-56d35.firebaseio.com",
    storageBucket: "bonseye-56d35.appspot.com",
    messagingSenderId: "827229640305"
};

firebase.initializeApp(config);

var database = firebase.database();

var userPreferencesRef = database.ref("preferences");
var userSessionRef = database.ref("session");