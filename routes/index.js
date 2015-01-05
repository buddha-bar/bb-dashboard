var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var url = require('url');
var etsyjs = require('etsy-js');
var mongoose = require('mongoose');
var bEtsy = require('../lib/buddhaetsy');
var etsy = require('../lib/buddhaetsy/etsy');
//test
var bcrypt =require('bcrypt');
var jwt = require('jwt-simple');
var config = require('../config');

module.exports = function(app) {

  var User = mongoose.model('User');
  var Item = mongoose.model('Item');
  var client = etsy.getClient();

  // 

  // app.get('/signup', function(req, res){
  // //whatever regan needs to signup page?
  // });

  // //get info from username
  // app.post('/signup', function(req, res){
  //   var newuser = User.new({
  //     username: req.username,
  //     password: req.password
  //   })
  //   newuser.save(function (err) {
  //     if(!err){
  //       console.dir(newuser);
  //     }
  //     else {
  //       console.log(err);
  //     }
  //   });
  // });

  app.get('/etsy', function(req, res) {
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

  app.get('/etsy/authorise', function(req, res) {
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
      // res.json(body);
      console.log(req.session.token);
      console.log(req.session.sec);
      //new constructor copying not creating new.
      // User.findOne({username: currentUser},function(err, something){

      //   User.credentials.etsy {
      //     etsy: {
      //       userid: body.user_id,
      //       usertoken: req.session.token,
      //       usersecret: req.session.secret
      //     }
      //   }
      // });

      // newuser.save(function (err) {
      //   if(!err){
      //     console.dir(newuser);
      //   }
      //   else {
      //     console.log(err);
      //   }
      // });
    });
    // redirect back to dashbaord; are we still getting information?
    res.redirect('/#/dashboard');
  });

  app.get('/api/etsy/getItemCount',function(req, res){
    bEtsy.getItemCount(req.params.itemID, function(err, body){
      if(err){
        console.log(err);
      }
      res.json(body.count);
    });
  });


  app.post('/api/items/:itemId', function(req, res){
    console.log("We're trying to update item #"+req.params.itemId);
    bEtsy.updateItemCount(req.params.itemId, req.params.stockCount, function(err, body){
      res.send(body.results[0]);
      Item.findOne({_id: req.params.itemId}, function(err, user){
        if (err) { return next(err); }
        Item.stock = req.params.stockCount;
        Item.save(function(err) {
          if (err) { return next(err); }
        });
      });

    });
    res.json(req.body);

    //Item.where({id: req.params.itemId})


    // use mongo to update database

    // #todo - make api calls as needed
    // response with json representing item
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
  // app.get('api/users', function(req, res, next) {
  //   var User = mongoose.model('User');
  //   User.find(function(err, users){
  //     if(err){ return next(err); }

  //     res.json(users);
  //     console.log(users);
  //   });
  // });

  // Get user
  // app.get('api/user', function(req, res, next) {
  //   var User = mongoose.model('User');
  //   User.find({username:'BillyBob'},function(err, foundItems){
  //     if(err){ return next(err); }

  //     res.json(foundItems);
  //     console.log(foundItems);
  //   });
  // });

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

  // app.post('/api/login', function(req, res, next){

  //   var User = mongoose.model('User');
  //   var currentUser = User.findOne({ username: req.params.username, password: req.params.password}, function(err, user){
  //     // console.log(req.params);
  //     console.log(currentUser);
  //     if(err){ return next(err); }

  //     res.json(user);
  //   });
  // });

  app.post('/api/sessions', function(req, res, next) {
    User.findOne({username: req.body.username})
    .select('password').select('username')
    .exec( function(err, user){
      if (err) {return next(err)}
      if (!user) {return res.send(401)}
      bcrypt.compare(req.body.password, user.password, function (err, valid){
        if (err) {return next(err)}
        if (!valid) {return res.send(401)}
        var token = jwt.encode({username: user.username}, config.secret)
      console.log(token);
        res.send(token)
      })
    })
  })

  app.get('/api/users', function (req, res, next) {
    if (!req.headers['x-auth']) {
      return res.sendStatus(401)
    }
    var auth = jwt.decode(req.headers['x-auth'], config.secret)
    User.findOne({username: auth.username}, function (err, user) {
      if (err) { return next(err) }
      res.json(user)
    })
  })

  app.post('/api/users', function(req, res, next) {
    var user = new User({username: req.body.username})
    bcrypt.hash(req.body.password, 10, function (err, hash){
      if (err) {return next (err)}
      user.password = hash
      user.save(function (err){
        res.send(201)
      })
    })
  })

// should recive and update item stock
  app.post('/api/:storeType/items/:itemId', function(req, res, next){
    // console.log(req.params);
    // console.log (req.params.itemId);

    var Item = mongoose.model('Item');
    Item.findOne({_id: req.params.itemId}, function(err, item){

      // console.log(item);

      // update item.stock to 300
      // save the item
      // respond with the item

      item.stock = req.body.stock;

      item.save(function (err) {
        // console.log('it worked');
        
        res.json(item);
      })

    });

    //item.find _id is passed
    //update and save

    //res.json({params: req.params});
  });

};




