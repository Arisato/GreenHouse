var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Listing = mongoose.model('listings', new Schema({
	id: ObjectId,
	dateAvailable: String,
	price: Number,
	paymentPeriod: String,
	propertyTyep: String,
	title: String,
	description: String
}));

var User = mongoose.model('users', new Schema({
	id: ObjectId,
	firstName: String,
	secondName: String,
	email: { type: String, unique: true },
	password: String
}));

//Connect to greenhouse DB
mongoose.connect('mongodb://localhost/greenhouse');

app.use(express.static(__dirname + "/public"));

// body parser middleware
app.use(bodyParser.json());

var getListings = function(req, res){
	console.log('GET request received');

	Listing.find(function(err, docs){
		console.log('Data received from DB:')
		console.log(docs);
		res.json(docs);
	});
};

var postRegister = function(req,res){
	console.log(req.body);
	var user = new User({
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
		}
		else{
			res.status(200).send({redirect: "/#/congratulations", firstName: req.body.firstName});
		}
	});
};

//GET listings
app.get('/listings', getListings);

// POST user account info
app.post('/register', postRegister);

var portGate = 7000;

app.listen(portGate);
console.log("Server is running on port " + portGate);
