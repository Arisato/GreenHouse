process.env.NODE_ENV = 'test'

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var server = require('../server');
var sch = require('../res/schemas');
var should = chai.should();
chai.use(chaiHttp);

var Schema = mongoose.Schema;
var ObjectId = Schema.Ob


describe('listings', function() {

 sch.Listing.collection.drop();

  beforeEach(function(done){
    var newListings = new sch.Listing({
      dateAvailable: '20/12/2015',
      price: 670,
      paymentPeriod: 'pm',
      propertyType: 'House',
      title: 'Nice House To Rent!',
      description: 'A big and spacious house that is not too expensive, has all facilities etc, viewing must be booked to see the property, please contact for any questions.'
    });

    newListings.save(function(err) {
      done();
    });
  });

  afterEach(function(done){
    sch.Listing.collection.drop();
    done();
  });


it('should list ALL listings on /listings GET', function(done){
  	chai.request(server.app)
  		.get('/listings')
  		.end(function(err, res){
  			res.should.have.status(200);
  			res.should.be.json;
      		res.body.should.be.a('array');
      		res.body[0].should.have.property('_id');
      		res.body[0].should.have.property('dateAvailable');
      		res.body[0].should.have.property('price');
      		res.body[0].should.have.property('paymentPeriod');
      		res.body[0].should.have.property('propertyType');
      		res.body[0].should.have.property('title');
      		res.body[0].should.have.property('description');
  			done();
  		});
  	});

});