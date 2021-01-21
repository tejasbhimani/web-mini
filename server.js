//import data from "./products";

const express = require('express');
const app = express();
var data = require('./public/products.json');
const parser = require("body-parser");
var firebase = require('firebase');
var nodemailer = require('nodemailer');
var cart = '';

app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());

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

app.post('/store_cart', function(req, res) {
    cart = req.body;
    cart = JSON.stringify(cart);
})


app.post('/contact', function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var message = req.body.message;
    if(!isNaN(name))
    {
        res.sendFile(__dirname+'/public/contactError.html')
    }
    else
    {
        firebase.database().ref('contacts').child(name).push({
            email: email,
            message: message
        });
        res.sendFile(__dirname + '/public/index.html');
    }
    
})

app.post('/auth', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    console.log(cart);
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
            console.log(cart);
            res.sendFile(__dirname + "/public/payment.html");
            // Signed in 
            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            res.sendFile(__dirname + '/public/login_error.html');
        });

});



app.post('/signup', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var address = req.body.address;
    console.log(cart);
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
            // Signed in 
            // ...
            firebase.database().ref('users').child(firebase.auth().currentUser.uid).set({
                email: email,
                address: address
            });

            res.sendFile(__dirname + "/public/payment.html");
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
            res.sendFile(__dirname + "/public/signup_error.html");
        });
})

app.post('/checkout', function(req, res) {
    var name = req.body.firstname;
    var email = req.body.email;
    var address = req.body.address;
    var city = req.body.city;
    var state = req.body.state;
    var pincode = req.body.zip;
    var cardname = req.body.cardname;
    var cardnumber = req.body.cardnumber;
    var expmonth = req.body.expmonth;
    var expyear = req.body.expyear;
    var cvv = req.body.cvv;
    firebase.database().ref('orders').push({
        email: email,
        items: cart,
        name: name,
        address: address,
        city: city,
        state: state,
        pincode: pincode,
        cardname: cardname,
        cardnumber: cardnumber,
        expmonth: expmonth,
        expyear: expyear,
        cvv: cvv
    });

    var orders = JSON.parse(cart);
    var ordertext = ""
    var i = 0;
    orders.forEach(order => {
        i++;
        ordertext += ` ${i} ) ${order.title} - ${order.price}, quantity : ${order.amount} \n`
    })
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'comfyhouse.contact@gmail.com',
            pass: 'comfy@1234'
        }
    });

    var mailOptions = {
        from: 'comfyhouse.contact@gmail.com',
        to: email,
        subject: 'Order Successfully place!',

        text: 'Congratulations ' + name + '!,\n\n\n Your payment was successful and your order of' + ordertext + '\n will be delivered in 7 working days\n\n Thank You for trusting us. \n\nIn case of any queries or complaints please contact us at: comfyhouse.contact@gmail.com'
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static("public"));

app.use(express.static("images"));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/login.html', function(req, res) {
    res.sendFile(__dirname + '/public/login.html');
});

app.post('/signup.html', function(req, res) {
    console.log('nnsns')
    res.sendFile(__dirname + '/public/signup.html');

});


app.get('/main.css', function(req, res) {
    res.sendFile(__dirname + '/main.css');
});


app.get('/data', function(req, res) {
    res.json(data);
});


app.listen(1234, function() {
    console.log("server listening");
});