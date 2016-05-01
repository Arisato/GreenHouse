var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./res/sConfig');
var sch = require('./res/schemas');
var userSession = require('client-sessions');
var email = require("./node_modules/emailjs/email");
var bcrypt = require('bcryptjs');

//Emailing Engine

var server  = email.server.connect({
   user:    "greenhousepropertyltd", 
   password:"d2937yf2g982gf1pfh92", 
   host:    "smtp.gmail.com", 
   ssl:     true
});

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

// Middleware
app.use(bodyParser.json());

app.use(userSession({
	cookieName: 'session',
	secret: '834gr3429gr9fb2gf2bif29g3gf23f10hf10ufsbdk29uth92h2h3of2hf0',
	duration: 30 * 60 * 1000,
	activeDuration: 10 * 60 * 1000,
	cookie: {
		httpOnly: true,
		ephemeral: true
	}
}));

app.use(function(req,res, next){
	if(req.session && req.session.user){
		sch.User.findOne({ email: req.session.user.email }, function(err, doc){
			if(doc){
				req.user = doc;
				//delete req.user.password;
				req.session.user = req.user;
			} 
			next();
		});
	} else{
		next();
	}
});

function loginRequest(req, res, next){
	if(!req.user){
		console.log('Access Denied');
		res.send({redirect: "/#/", resStatus1: "You have to be loged in."});
	} else{
		console.log('Access Granted');
		next();
	}
};


//Functionality

var sendEmail = function(req,res){
	if(req.body.name && req.body.email && req.body.message){
		sch.User.findOne({ _id: req.params.id }, function(err, doc){
			if(!doc){
				res.send({resStatus: "User you trying to email does not exist."});
			} else{
				server.send({
					text:    req.body.message+ "             Please use this email for reply: " +req.body.email, 
   					from:    req.body.name+ " <greenhousepropertyltd@gmail.com>", 
   					to:      doc.firstName+ " <"+doc.email+">",
   					//cc:      "else <else@your-email.com>",
   					subject: "In regards of property advertised on Green House."
				}, function(err, message) { 
					if(message){
						res.send({resStatus: "Email sent successfully!"});
					} else{
						res.send({resStatus: "Failed to send an email... :("});
					}
					console.log(err || message); 
				});
			}
		});
	} else{
		res.send({resStatus2: "Please fill all the fields before sending."});
	}
};

var getListings = function(req, res){
	console.log('GET request received');
	sch.Listing.find().sort({ dateAdded: -1 }).exec(function(err, docs){
		if(docs.length === 0){
			res.send({resStatus: 'There are no live ads at the moment.'});
		} else{
			console.log('Data received from DB:')
			console.log(docs + '\n');
			res.json(docs);
		}
	});
};

var postRegister = function(req,res){
	if(req.body.password === undefined || req.body.email === undefined || req.body.email2 === undefined || req.body.password2 === undefined){
		return res.send({error: "At least one of the fields is empty. Please fill in all the fields."});
	}
	if(req.body.email.length > 50 || req.body.password.length > 50){
		return res.send({error: "Input in one of the fields exceeds 15 characters"});
	}
	if(req.body.password === req.body.password2 && req.body.email === req.body.email2){
		var hashPass = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

		console.log(req.body);
		var user = new sch.User({
			firstName: req.body.firstName,
			secondName: req.body.secondName,
			email: req.body.email,
			password: hashPass
		});
		user.save(function(err){
			if(err){
				var error = 'Something went wrong! Make sure all fields are filled. If problem persist, please try again later.';
				if(err.code === 11000){
					error = 'This email is already registered, please choose another.'
				};
				res.send({error: error});
			} else{
				res.status(200).send({redirect: "/#/congratulations", firstName: req.body.firstName});
			}
		});
	} else{
		res.send({error: 'Email or Password mismatch.'});
	}
};

var postLogin = function(req,res){
	console.log(req.body);
	if(req.body.email.length > 50 || req.body.password.length > 50){
		return res.send({error: "Input in one of the fields exceeds 50 characters"});
	}
	sch.User.findOne({ email: req.body.email }, function(err, doc){
		if(!doc){
			var error = 'Email or password is incorrect'
 			res.send({error: error});
 			console.log(error);
		} else{
			console.log('Email is correct.');
			if(bcrypt.compareSync(req.body.password, doc.password)){
				console.log('Password is correct.');
				req.session.user = doc; //Encrypted user info
				res.status(200).send({redirect: "/#/login"});
			} else{
				var error = 'Email or password is incorrect'
 				res.send({error: error});
 				console.log(error);
			}
		}
	});
};

var getProfile = function(req,res){
	sch.User.findOne({ email: req.session.user.email }, function(err,doc){
		if(!doc){
			req.session.reset();
			res.send({redirect: "/#/"});
		} else{
			console.log('User info sent');
			//console.log(req.session.user._id);
			res.status(200).send({redirect: "/#/profile", user: {
									id: doc._id,
									firstName: doc.firstName,
									secondName: doc.secondName,
									email: doc.email
				}
			});
		}
	});
};

var postAd = function(req, res){
	var listing = new sch.Listing({
		dateAdded: req.body.dateAdded,
		userFirstName: req.session.user.firstName,
		userId: req.session.user._id,
		address: req.body.address,
		city: req.body.city,
		county: req.body.county,
		postCode: req.body.postCode,
		dateAvailable: req.body.dateAvailable,
		price: req.body.price,
		paymentPeriod: req.body.paymentPeriod,
		propertyType: req.body.propertyType,
		title: req.body.title,
		description: req.body.description
	});
	listing.save(function(err){
		if(err){
			var error = 'Something went wrong! Please try again later.';
			res.send({response: error});
		} else{
			res.status(200).send({resStatus: "Your ad is live!"});
		}
	});
};

var getAds = function(req,res){
	sch.Listing.find({ userId: req.session.user._id },function(err, docs){
		if(docs.length === 0){
			//console.log('No Docs Reached');
			//console.log(docs);
			res.send({resStatus: 'You have no live ads at the moment.'});
		} else{
			//console.log(docs);
			res.json(docs);
		}
	});
};

var deleteAd = function(req,res){
	sch.User.findOne({ email: req.session.user.email }, function(err, doc){
		if(req.session.user.email === doc.email && req.session.user.password === doc.password){
			sch.Listing.findOne({ _id: req.params.id }, function(err, docUser){
				console.log('This is Doc ' +docUser.userId);
				console.log('This is Session ' +req.session.user._id);
				if(req.session.user._id == docUser.userId){ //Focus error
					sch.Listing.remove({ _id: req.params.id }, function(err, docListing){
						res.send({resStatus: 'Ad removed successfully.'});
					});
				} else{
					res.send({resStatus: 'Cheeky! This ad does not belong to you!'});
				}
			});
		} else{
			res.send({resStatus: 'You need to login first!'});
		}
	});
};

var getAd = function(req,res){
	sch.Listing.findOne({ _id: req.params.id }, function(err,doc){
		if(!doc){
			res.send({redirect: '/#/myads'});
		} else{
			res.json(doc);
		}
	});
};

var updateAd = function(req,res){
	sch.User.findOne({ email: req.session.user.email }, function(err, doc){
		if(req.session.user.email === doc.email && req.session.user.password === doc.password){
			sch.Listing.findOne({ _id: req.params.id }, function(err, doc){
				if(req.session.user._id == doc.userId){
					var request = req.body;
						request.dateAdded = doc.dateAdded;
						request.userId = doc.userId;
						request._id = doc._id;
					sch.Listing.findOneAndUpdate({ _id: doc._id }, request, function(err, doc){
						res.send({resStatus: 'Your ad has been updated successfully!'});
					});
				} else{
					res.send({resStatus: 'Cheeky! This ad does not belong to you!'});
				}
			});
		} else{
			res.send({resStatus: 'You need to login first!'});
		}
	});
};

var searchAds = function(req,res){
	console.log('Search Keyword: ' +req.params.key);
	sch.Listing.find({ $or: [{ address: req.params.key },
							 { city: req.params.key }, 
							 { county: req.params.key },
							 { postCode: req.params.key }, 
							 { propertyType: req.params.key }, 
							 { title: req.params.key }] }, function(err,docs){
							 	if(docs.length === 0){
							 		res.send({resStatus: 'Keyword: ' +req.params.key+ ' has not yielded any results.'});
							 	} else{
							 		res.json(docs);
							 	}
							 });
};

var getAdPublic = function(req,res){
	sch.Listing.findOne({ _id: req.params.id }, function(err,doc){
		if(!doc){
			res.send({redirect: '/#/login'});
		} else{
			res.json(doc);
		}
	});
};

var logoutUser = function(req, res){
	req.session.reset();
	res.send({response: 'success'});
};

//GET listings
app.get('/listings', getListings);

//GET User profile
app.get('/profile', loginRequest, getProfile);

//GET user ads
app.get('/myads', loginRequest, getAds);

//GET users ad to edit
app.get('/getad/:id', loginRequest, getAd);

//GET search ads
app.get('/search/:key', searchAds);

//GET ad details
app.get('/addetail/:id', getAdPublic);

//PUT update users ad
app.put('/update/:id', loginRequest, updateAd);

//POST new ad
app.post('/newad', loginRequest, postAd);

//POST email ad owner
app.post('/emailad/:id', loginRequest, sendEmail);

//POST user account info
app.post('/register', postRegister);

//POST user login info
app.post('/login', postLogin);

//DELETE users ad
app.delete('/remove/:id', loginRequest, deleteAd);

//GET User logout
app.get('/logout', logoutUser);


var appPortGate = 7000;

app.listen(appPortGate);
console.log("App server is running on port " + appPortGate);

module.exports.app = app;
