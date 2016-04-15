var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Listing = mongoose.model('listings', new Schema({
	id: ObjectId,
	dateAdded: { type: String, required: true },
	userFirstName: { type: String, required: true },
	userId: { type: String, required: true },
	address: { type: String, required: true },
	city: { type: String, required: true },
	county: { type: String, required: true },
	postCode: { type: String, required: true },
	dateAvailable: { type: String, required: true },
	price: { type: String, required: true },
	paymentPeriod: { type: String, required: true },
	propertyType: { type: String, required: true },
	title: { type: String, required: true },
	description: { type: String, required: true }
}));

var User = mongoose.model('users', new Schema({
	id: ObjectId,
	firstName: { type: String, required: true },
	secondName: { type: String, required: true },
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true }
}));

module.exports.Listing = Listing;
module.exports.User = User;