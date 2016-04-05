var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./res/sConfig');
var sch = require('./res/schemas');

//Connect to greenhouse DB
//mongoose.connect('mongodb://localhost/greenhouse');

mongoose.connect(config.mongoURI[app.settings.env], function(err, res) {
  if(err) {
    console.log('Could not connect to database. ' + err);
  } else {
    console.log('Connection to database successful ' + config.mongoURI[app.settings.env] + '\n');
  }
});

app.use(express.static(__dirname + "/public"));

// body parser middleware
app.use(bodyParser.json());

var getListings = function(req, res){
	console.log('GET request received');

	sch.Listing.find(function(err, docs){
		console.log('Data received from DB:')
		console.log(docs + '\n');
		res.json(docs);
	});
};

var postRegister = function(req,res){
	console.log(req.body);
	var user = new sch.User({
		firstName: req.body.firstName,
		secondName: req.body.secondName,
		email: req.body.email,
		password: req.body.password
	});
	user.save(function(err){
		if(err){
			var error = 'Something went wrong, please try again.';
			if(err.code === 11000){
				error = 'Email is in use, please choose another.'
			};
			res.send({error: error});
		} else{
			res.status(200).send({redirect: "/#/congratulations", firstName: req.body.firstName});
		}
	});
};

var postLogin = function(req,res){
	console.log(req.body);
	var qr = sch.User.findOne({ email: req.body.email }, function(err, doc){
		if(!doc){
			var error = 'Email or password is incorrect'
 			res.send({error: error});
 			console.log(error);
		} else{
			console.log('Email is correct.');
			if(req.body.password === doc.password){
				console.log('Password is correct.');
				res.status(200).send({redirect: "/#/login", email: req.body.email});
			} else{
				var error = 'Email or password is incorrect'
 				res.send({error: error});
 				console.log(error);
			}
		}
	});
};

//GET listings
app.get('/listings', getListings);

//POST user account info
app.post('/register', postRegister);

//POST user login info
app.post('/login', postLogin);

var portGate = 7000;

app.listen(portGate);
console.log("Server is running on port " + portGate);

module.exports.app = app;
