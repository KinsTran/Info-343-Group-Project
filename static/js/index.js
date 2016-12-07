"use strict";

var signUpForm = document.getElementById("sign-up-form");
var userEmail = document.getElementById("email");
var userName = document.getElementById("display");
var userPassword = document.getElementById("password");
var userConfirmation = document.getElementById("confirm");

signUpForm.addEventListener("submit", function(evt) {
    evt.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(userEmail.value, userPassword.value)
    .then(function(user) {
        return user.updateProfile({
            displayName: userName.value
        });
    })
    .then(function() {
        window.location = "app.html";
    })
    .catch(function(error) {
        console.log(error.message);
    });

    return false;
})