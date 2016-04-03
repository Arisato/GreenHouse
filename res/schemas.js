var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Listing = mongoose.model('listings', new Schema({
	id: ObjectId,
	dateAvailable: String,
	price: Number,
	paymentPeriod: String,
	propertyType: String,
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

module.exports.Listing = Listing;
module.exports.User = User;