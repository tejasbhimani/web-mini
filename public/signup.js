import firebase from 'firebase';

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");
  // Set the configuration for your app
  // TODO: Replace with your project's config object
  var config = {
    apiKey: "AIzaSyCzX8sKSTnJXEMCw_Q3MzJviP7Xr4U6kEI",
    authDomain: "furniture-store-c3d57.firebaseapp.com",
    databaseURL: "https://furniture-store-c3d57-default-rtdb.firebaseio.com/",
    storageBucket: "furniture-store-c3d57.appspot.com"
  };
  firebase.initializeApp(config);
  // Get a reference to the database service
  database = firebase.database();

  var button = document.getElementById('signup_button');
  button.addEventListener('click',signup);
function signup(){
    var email = document.getElementById('login_email').value;
    var password = document.getElementById('login_password').value;
    var address = document.getElementById('address').value;
    window.alert("yess");
    
}

