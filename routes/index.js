var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var url = require('url');
var etsyjs = require('etsy-js');
var mongoose = require('mongoose');
var bEtsy = require('../lib/buddhaetsy');
var etsy = require('../lib/buddhaetsy/etsy');

module.exports = function(app) {

  var User = mongoose.model('User');
  var Item = mongoose.model('Item');
  var client = etsy.getClient();

  // Should get all users
  app.get('/users', function(req, res, next) {
    var User = mongoose.model('User');
    User.find(function(err, users){
      if(err){ return next(err); }

      res.json(users);
      console.log(users);
    });
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
      res.redirect('/api/etsy/find');
    });
  });

  app.get('/api/etsy/find', function(req, res) {
    bEtsy.getUsersEtsyInfo(req, res, function(err, body){
      if (err) {
        console.log(err);
      }
      res.json(body);
      console.log(req.session.token);
      console.log(req.session.sec);
      //new constructor copying not creating new.
      var newuser = new User({
        credentials: {
          etsy: {
            userid: body.user_id,
            usertoken: req.session.token,
            usersecret: req.session.secret
          }
        }
      })

      newuser.save(function (err) {
        if(!err){
          console.dir(newuser);
        }
        else {
          console.log(err);
        }
      });
    });
  });

  app.get('/api/etsy/getItemCount',function(req, res){
    bEtsy.getItemCount(req, res, function(err, body){
      if(err){
        console.log(err);
      }
      res.json(body.count);
    });
  });

  app.get('/api/etsy/updateItemCount', function(req, res){
    bEtsy.updateItemCount(req, res, function(err, body){
      res.send(body.results[0]);
      res.json(body);
    });
  });

  app.get('/api/etsy/getListings',function(req, res){
    //returns a list of active listings from the users shop.
    // can do this and put call back in all listings instead  
    // callback = function(err, body){
    // };
    bEtsy.getAllListings(req, res, function(err, body) {
      res.json(body);
    });
  });
    // Potentially necesary for updating info in db.
    //   User.findOneAndUpdate({_id:'548e08ca89e002360ddb0d6d'}, {$push: {items: newitem}},
    //     {safe: true, upsert: true},
    //     function(err, model){ 
    //     if (err) {
    //       console.log(err);
    //     }
    //     else {
    //     console.dir("working");
    //     }
    //   });
  



  //regan estract data from db (temp)

  // Should get all users
  app.get('api/users', function(req, res, next) {
    var User = mongoose.model('User');
    User.find(function(err, users){
      if(err){ return next(err); }

      res.json(users);
      console.log(users);
    });
  });

  // Get user
  app.get('api/user', function(req, res, next) {
    var User = mongoose.model('User');
    User.find({username:'BillyBob'},function(err, foundItems){
      if(err){ return next(err); }

      res.json(foundItems);
      console.log(foundItems);
    });
  });

  // Should get all user items

  app.get('/api/items', function(req, res, next) {
    var Item = mongoose.model('Item');
    Item.find(function(err, items){
      if(err){ return next(err); }

      // var user = user[0];

      // var items = user.items;
      // items.forEach(function(item) {
      //   item._id = mongoose.Types.ObjectId();
      // });

      res.json(items);
    });
  });


// should recive and update item stock
  app.post('/api/:storeType/items/:itemId', function(req, res, next){
    console.log(req.params);
    console.log (req.params.itemId);

    res.json({params: req.params});
  });

};



