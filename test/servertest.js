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


describe('Server', function() {
  this.timeout(60000);

  before(function(done){
    var newListings = new sch.Listing({
      dateAvailable: '20/12/2015',
      dateAdded: 'added',
      userFirstName: 'Exo',
      userId: 'Some ID',
      address: '20 Road',
      city: 'Brighton',
      county: 'East Sussex',
      postCode: 'GT5 GT5',
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

  after(function(done){
    sch.Listing.collection.drop();
    sch.User.collection.drop();
    done();
  });

var adId;
var recipient;

it('Should list ALL listings on /listings GET', function(done){
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
          res.body[0].should.have.property('dateAdded');
          res.body[0].should.have.property('userFirstName');
          res.body[0].should.have.property('userId');
          res.body[0].should.have.property('address');
          res.body[0].should.have.property('city');
          res.body[0].should.have.property('county');
          res.body[0].should.have.property('postCode');
  			done();
  		});
  	});

it('Should register a single user on /register POST', function(done){
    chai.request(server.app)
      .post('/register')
      .send({'firstName': 'Exo', 'secondName': 'Back', 'email': 'some@email.com', 'email2': 'some@email.com', 'password': '12345', 'password2': '12345'})
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('redirect');
          res.body.should.have.property('firstName');
          res.body.firstName.should.equal('Exo');
          res.body.redirect.should.equal('/#/congratulations');
        done();
      });
    });

it('Should register a another user that will be used to test emailing. On /register POST', function(done){
    chai.request(server.app)
      .post('/register')
      .send({'firstName': 'Tester', 'secondName': 'Test', 'email': 'test@email.com', 'email2': 'test@email.com', 'password': '12345', 'password2': '12345'})
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('redirect');
          res.body.should.have.property('firstName');
          res.body.firstName.should.equal('Tester');
          res.body.redirect.should.equal('/#/congratulations');
        done();
      });
    });

it('Should login a single user on /login POST', function(done){
    chai.request(server.app)
      .post('/login')
      .send({'email': 'test@email.com', 'password': '12345'})
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('redirect');
          res.body.redirect.should.equal('/#/login');
        done();
      });
    });


  it('Should send back profile data as long as user is loged in. On /profile GET', function(done){
    // Log in
    var agent = chai.request.agent(server.app)
    agent
      .post('/login')
      .send({ email: 'some@email.com', password: '12345' })
      .then(function () {
       
        return agent.get('/profile')
         .then(function (res) {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('object');
              res.body.should.have.property('redirect');
              res.body.should.have.property('user');
              res.body.user.should.have.property('id');
              res.body.user.should.have.property('firstName');
              res.body.user.should.have.property('secondName');
              res.body.user.should.have.property('email');
              res.body.redirect.should.equal('/#/profile');
              res.body.user.firstName.should.equal('Exo');
              res.body.user.secondName.should.equal('Back');
              res.body.user.email.should.equal('some@email.com');
              recipient = res.body.user.id;
             done();
          })
      })    
  });

it('Should insert new ad into database as long as user is loged in. On /newad POST', function(done){
    var agent = chai.request.agent(server.app)
    agent
      .post('/login')
      .send({ email: 'some@email.com', password: '12345' })
      .then(function () {
       
          agent.post('/newad')
          .send({dateAdded: 'date',
                  address: '20 Road',
                  city: 'Brighton', 
                  county: 'East Sussex', 
                  postCode: 'GT5 GT5', 
                  dateAvailable: '25/07/2016', 
                  price: '1200', 
                  paymentPeriod: 'PM', 
                  propertyType: 'House', 
                  title: 'Big House For Rent', 
                  description: 'Quick description'})
          .then(function (res) {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('object');
              res.body.should.have.property('resStatus');
              res.body.resStatus.should.equal('Your ad is live!');
             done();
          })
      })    
  });

  it('Should retrieve all ads of the specific user on /myads GET', function(done){
    var agent = chai.request.agent(server.app)
    agent
      .post('/login')
      .send({ email: 'some@email.com', password: '12345' })
      .then(function () {
       
          agent.get('/myads')
          .then(function (res) {
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
              res.body[0].should.have.property('dateAdded');
              res.body[0].should.have.property('userFirstName');
              res.body[0].should.have.property('userId');
              res.body[0].should.have.property('address');
              res.body[0].should.have.property('city');
              res.body[0].should.have.property('county');
              res.body[0].should.have.property('postCode');

              res.body[0].dateAdded.should.equal('date');
              res.body[0].dateAvailable.should.equal('25/07/2016');
              res.body[0].price.should.equal('1200');
              res.body[0].paymentPeriod.should.equal('PM');
              res.body[0].propertyType.should.equal('House');
              res.body[0].title.should.equal('Big House For Rent');
              res.body[0].description.should.equal('Quick description');
              res.body[0].userFirstName.should.equal('Exo');
              res.body[0].address.should.equal('20 Road');
              res.body[0].city.should.equal('Brighton');
              res.body[0].county.should.equal('East Sussex');
              res.body[0].postCode.should.equal('GT5 GT5');

              adId = res.body[0]._id;
              done();
          })
              
      })
});    

it('Should get a specific ad on /getad/:id GET', function(done){
    var agent = chai.request.agent(server.app)
    agent
      .post('/login')
      .send({ email: 'some@email.com', password: '12345' })
      .then(function () {
       
       agent.get('/getad/' +adId)
              .then(function (res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('dateAvailable');
                res.body.should.have.property('price');
                res.body.should.have.property('paymentPeriod');
                res.body.should.have.property('propertyType');
                res.body.should.have.property('title');
                res.body.should.have.property('description');
                res.body.should.have.property('dateAdded');
                res.body.should.have.property('userFirstName');
                res.body.should.have.property('userId');
                res.body.should.have.property('address');
                res.body.should.have.property('city');
                res.body.should.have.property('county');
                res.body.should.have.property('postCode');

                res.body.dateAdded.should.equal('date');
                res.body.dateAvailable.should.equal('25/07/2016');
                res.body.price.should.equal('1200');
                res.body.paymentPeriod.should.equal('PM');
                res.body.propertyType.should.equal('House');
                res.body.title.should.equal('Big House For Rent');
                res.body.description.should.equal('Quick description');
                res.body.userFirstName.should.equal('Exo');
                res.body.address.should.equal('20 Road');
                res.body.city.should.equal('Brighton');
                res.body.county.should.equal('East Sussex');
                res.body.postCode.should.equal('GT5 GT5');
                done();
              })
      })    
  });

  // it('Should update specific ad of a specific user on /update/:id PUT', function(done){
  //   var agent = chai.request.agent(server.app)
  //   agent
  //     .post('/login')
  //     .send({ email: 'some@email.com', password: '12345' })
  //     .then(function () {
        
  //       agent.put('/update/' +adId)
  //       .send({dateAdded: 'date', 
  //             _id: 'wont let update this atr', 
  //             dateAdded: 'wont let update this atr', 
  //             userId: 'wont let update this atr',
  //             address: '20 Road',
  //             city: 'Brighton', 
  //             county: 'East Sussex', 
  //             postCode: 'GT5 GT5', 
  //             dateAvailable: '25/07/2016', 
  //             price: '1200', 
  //             paymentPeriod: 'PM', 
  //             propertyType: 'House', 
  //             title: 'Updated Title', 
  //             description: 'Quick description'})
  //         .then(function (res){
  //             res.should.have.status(200);
  //             res.should.be.json;
  //             res.body.should.be.a('object');
  //             res.body.should.have.property('resStatus');
  //             res.body.resStatus.should.equal('Your ad has been updated successfully!');
  //         })
  //         .then(function (){
  //             agent.get('/getad/' +adId)
  //             .then(function (res){
  //                 res.should.have.status(200);
  //                 res.should.be.json;
  //                 res.body.should.be.a('object');
  //                 res.body.should.have.property('title');
  //                 res.body.title.should.equal('Updated Title');
  //                 done();
  //             })
  //         })  
  //     })    
  // });

  it('Should get specific ad details without user being loged in on /addetail/:id GET', function(done){
    chai.request(server.app)
      .get('/addetail/' +adId)
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('_id');
        res.body.should.have.property('dateAvailable');
        res.body.should.have.property('price');
        res.body.should.have.property('paymentPeriod');
        res.body.should.have.property('propertyType');
        res.body.should.have.property('title');
        res.body.should.have.property('description');
        res.body.should.have.property('dateAdded');
        res.body.should.have.property('userFirstName');
        res.body.should.have.property('userId');
        res.body.should.have.property('address');
        res.body.should.have.property('city');
        res.body.should.have.property('county');
        res.body.should.have.property('postCode');

        res.body.dateAdded.should.equal('date');
        res.body.dateAvailable.should.equal('25/07/2016');
        res.body.price.should.equal('1200');
        res.body.paymentPeriod.should.equal('PM');
        res.body.propertyType.should.equal('House');
        res.body.title.should.equal('Big House For Rent');
        res.body.description.should.equal('Quick description');
        res.body.userFirstName.should.equal('Exo');
        res.body.address.should.equal('20 Road');
        res.body.city.should.equal('Brighton');
        res.body.county.should.equal('East Sussex');
        res.body.postCode.should.equal('GT5 GT5');
        done();
      });  
  });
  
  it('Should get all ads matching the keyword entered on /search/:key GET', function(done){
    chai.request(server.app)
      .get('/search/' + 'Brighton')
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].should.have.property('city');
        res.body[1].should.have.property('city');
        res.body[0].city.should.equal('Brighton');
        res.body[1].city.should.equal('Brighton');
        done();
      });  
  });

  it('Should send and email to ad owner if sender is loged in on the platform on /emailad/:id', function(done){
    var agent = chai.request.agent(server.app)
    agent
      .post('/login')
      .send({ email: 'test@email.com', password: '12345' })
      .then(function () {
       
          agent.post('/emailad/' +recipient)
          .send({name: 'Tester', email: 'test@email.com', message: 'Quick message.'})
          .then(function (res) {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('object');
              res.body.should.have.property('resStatus');
              res.body.resStatus.should.equal('Email sent successfully!');
             done();
          })
      })    
  });

  it('Should delete specific users, specific ad if said user is loged in. On /remove/:id DELETE', function(done){
    var agent = chai.request.agent(server.app)
    agent
      .post('/login')
      .send({ email: 'some@email.com', password: '12345' })
      .then(function () {
       
          agent.delete('/remove/' +adId)
          .then(function (res) {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('object');
              res.body.should.have.property('resStatus');
              res.body.resStatus.should.equal('Ad removed successfully.');
             done();
          })
      })    
  });

  it('Should logout user from the platform on /logout GET', function(done){
    var agent = chai.request.agent(server.app)
    agent
      .post('/login')
      .send({ email: 'some@email.com', password: '12345' })
      .then(function () {
       
          agent.get('/logout')
          .then(function (res) {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('object');
              res.body.should.have.property('response');
              res.body.response.should.equal('success');
             done();
          })
      })    
  });





});