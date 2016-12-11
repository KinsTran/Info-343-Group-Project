"use strict";

var signUpForm = document.getElementById("login-page-forms");
var userEmail = document.getElementById("email");
var userName = document.getElementById("display");
var userPassword = document.getElementById("password");
var userConfirmation = document.getElementById("confirm");
var errorBox = document.getElementById("error");

firebase.auth().onAuthStateChanged(function(user) { // Redirects to app.html if user is already logged in
    if(user) {
        location = "app.html";
    }
})

signUpForm.addEventListener("submit", function(evt) {
    // clear out previous error message
    errorBox.innerHTML = "";
    evt.preventDefault();
    if (userPassword.value == userConfirmation.value) {
        firebase.auth().createUserWithEmailAndPassword(userEmail.value, userPassword.value)
        .then(function(user) {
            // firebase.database().ref("settings/" + user.uid)
            userSettingsRef.child(user.uid).set({
                prefs: {default: "default"}
            });
            userSessionRef.child(user.uid).set({
                users: {default: "default"},
                place: "null",
                active: true
            })
            return user.updateProfile({
                displayName: userName.value
            });
        })
        .then(function() {
            window.location = "app.html";
        })
        .catch(function(error) {
            // let user know why they can't sign up
            var p = document.createElement("p");
            p.textContent = error;
            errorBox.appendChild(p);
        });
    } else {
        var p = document.createElement("p");
        p.textContent = "Make sure your password inputs match!";
        errorBox.appendChild(p);
    }

    return false;
});