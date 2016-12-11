"use strict";

var signInForm = document.getElementById("login-page-forms");
var userEmail = document.getElementById("email");
var userPassword = document.getElementById("password");
var errorBox = document.getElementById("error");

firebase.auth().onAuthStateChanged(function(user) { // Redirects to app.html if user is already logged in
    if(user) {
        location = "app.html";
    }
})

signInForm.addEventListener("submit", function(evt) {
    errorBox.innerHTML = "";
    evt.preventDefault();

    firebase.auth().signInWithEmailAndPassword(userEmail.value, userPassword.value)
    .then(function() {
        window.location = "app.html";
    })
    .catch(function(error) {
        var p = document.createElement("p");
        p.textContent = error;
        errorBox.appendChild(p);
    });

    return false;
});