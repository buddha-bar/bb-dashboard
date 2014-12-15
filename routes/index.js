var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var url = require('url');
var etsyjs = require('etsy-js');
var mongoose = require('mongoose');

module.exports = function(app) {

  var User = mongoose.model('User');
  var Item = mongoose.model('Item');
  // Should get all users
  app.get('/users', function(req, res, next) {
    var User = mongoose.model('User');
    User.find(function(err, users){
      if(err){ return next(err); }

      res.json(users);
      console.log(users);
    });
  });


  var client = etsyjs.client({
    key: 'glv40yg7ycl6czknj4f9v0xw',
    secret: 'w1udrm2cuk',
    callbackURL: 'http://localhost:3000/authorise'
  });


  app.get('/test', function(req, res) {
    client.requestToken(function(err, response) {
      console.log(response);
      if (err) {
        return console.log(err);
      }
      console.log(req.session.token);
      req.session.token = response.token;
      req.session.sec = response.tokenSecret;
      res.redirect(response.loginUrl);
    });
  });

  app.get('/authorise', function(req, res) {
    // parse the query string for OAuth verifier
    query = url.parse(req.url, true).query;
    verifier = query.oauth_verifier;

    // final part of OAuth dance, request access token and secret with given verifier
    client.accessToken(req.session.token, req.session.sec, verifier, function(err, response) {
      // update our session with OAuth token and secret
      console.log('Error', err);
      console.log('Response', response);
      req.session.token = response.token;
      req.session.sec = response.tokenSecret;
      res.redirect('/find');
    });
  });

  app.get('/find', function(req, res) {
    // we now have OAuth credentials for this session and can perform authenticated requests
    console.log('sec', req.session.sec);
    client.auth(req.session.token, req.session.sec).user("donaldballard1").addresses(function(err, body, headers) {
      if (err) {
        console.log(err);
      }
      console.log("creating user");
      var newuser = new User({
         credentials: {
             etsy: {
                userid: body.user_id,
                usertoken: req.session.token,
                usersecret: req.session.secret
             }
         }
      });
      console.log("done creating before save");
      newuser.save(function (err) {
        if(!err){
          console.log("user save successful");
        }
        else {
          console.log("error during user save");
        }
      });
      console.log("after save and printing body ");
        if (body) {
          console.dir(body);
          res.send(body.results[0]);
        } else {
          res.status(403);
          res.send("Not Authorized");
        }     
      });
    });

  app.get('/shops',function(req, res){
    var listings = {
        
        include_private: true
    }
    client.auth(req.session.token, req.session.sec).get('/shops/buddhabarapp/listings/active', listings, function(err, status, body, headers){
      if (err) {
          console.log(err);
      }
      console.log("creating new item");
      
      var newitem = new Item({
        name: body.title,
        stock: body.quantity,
        image: "lalishdfio;awhet"
      });
      //save the new item
      
      User.findOneAndUpdate({_id:'548e08ca89e002360ddb0d6d'}, {$push: {items: newitem}},
        {safe: true, upsert: true},
        function(err, model){ 
        if (err) {
          console.log(err);
        }
        else {
        console.dir("working");
        }
      });

      if (body) {
        console.dir(body);
        res.send(body.results[0]);
      } else {
        res.status(403);
        res.send("Not Authorized");
      }
    });
  });



  //regan estract data from db (temp)

  // Should get all users
  app.get('/users', function(req, res, next) {
    var User = mongoose.model('User');
    User.find(function(err, users){
      if(err){ return next(err); }

      res.json(users);
      console.log(users);
    });
  });

  // Get user
  app.get('/items', function(req, res, next) {
    var User = mongoose.model('User');
    User.find({username:'BillyBob'},function(err, foundItems){
      if(err){ return next(err); }

      res.json(foundItems);
      console.log(foundItems);
    });
  });

  // Should get all user items
  app.get('/items', function(req, res, next) {
    var User = mongoose.model('User');
    User.find({username:'BillyBob','items[0]':req.params.query},function(err, foundItems){
      if(err){ return next(err); }

      res.json(foundItems);
      console.log(foundItems);
    });
  });

  // var billy = db.users.find( { "_id" : "548f38ef219b577ea273a691"} );
  // var item1 = billy.items[0]
  // console.log(billy);
  // console.log(item1);
};
