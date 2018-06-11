var express = require("express");
var nodemailer = require("nodemailer");
var bodyParser = require("body-parser");

var Customer = require('./customerInfo');
var db = require('./dbconnect');
var randomString = require('random-string');


var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

function callMail(email, customerToken) {
    console.log(customerToken);
    nodemailer.createTestAccount((err, account) => {
        var transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "akshayhegde9972@gmail.com",
                pass: "1234anuj"
            },
        });

        var mailOptions = {
            from: '"Akshay" <akshayhegde9972@gmail.com>',
            to: email,
            subject: "Hello ✔ - You have been registered!",
            text: "Welcome !" + email + "! You have been registered! Please click on the link below to complete the registration",
            html: `<a href='http://localhost:3000/verifyData/${email}/${customerToken}'>Click this to verify</a>`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log("Message sent: %s", info.messageId);

            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        });
    });
}

app.post("/", function (req, res) {
    callMail();
});

app.get("/verifyData/:customerEmail/:customerToken", function (req, res) {

    var customer = new Customer();
    customer.customerEmail = req.params.customerEmail;
    customer.customerToken = req.params.customerToken;


    console.log(customer.customerEmail);
    console.log(customer.customerToken);

    Customer.findOne({customerEmail: customer.customerEmail}, function (err, customers) {
        var databaseToken = customers.customerToken;
        if (err) {
            console.log(err);
            res.end({"Error" : "Error has taken place"});
        }
  /*      console.log('databaseToken ----> ' + databaseToken);
        console.log('customer.customerToken ----> ' + customer.customerToken);*/
        if (databaseToken == customer.customerToken) {
            console.log('In if');

            Customer.update(customers, {$set : {customerVerified : true}}, function (err,customer) {
                if (err) throw err;
                res.send('You have been verified!');
            });
        } else {
            res.send("Invalid Token");
        }

    })


});

app.get("/getData/", function (req, res) {

    Customer.find({}, function (err, customers) {
        if (err) {
            console.log(err)
        } else {
            console.log(customers);
            res.json(customers);
            res.end();
        }
    })

});

app.post("/enteringCustomer/", function (req, res) {

    var customer = new Customer();
    var x = randomString({length: 14});
    console.log('Token is : ' + x);


    customer.customerEmail = req.body.customerEmail;
    customer.customerToken = x;


    customer.save(function (err) {
        if (err) throw err;

        callMail(customer.customerEmail, customer.customerToken);
        res.json({"Status": "Customer Saved"});
    });

});

app.listen(3000, function (err) {
    if (err) throw err;
    console.log("Server is running");
});