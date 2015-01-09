var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var url = require('url');
var etsyjs = require('etsy-js');
var mongoose = require('mongoose');
var bEtsy = require('../lib/buddhaetsy');
var etsy = require('../lib/buddhaetsy/etsy');
var ebay = require('ebay-api');
var daEbay = require('../lib/buddhaebay');
//test
var bcrypt =require('bcrypt');
var jwt = require('jwt-simple');
var config = require('../config');
var puller = require('../lib/workers/puller')
module.exports = function(app) {
  var User = mongoose.model('User');
  var Item = mongoose.model('Item');
  var client = etsy.getClient();
  function updateItem(item,cb){
    Item.find({name : item.name}, function (err, docs) {
      if (err){
        cb('item exists already',null);
      }else{
        item.save(function(err){
          cb(err,item);
        });
      }
    });
  };
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
//THE FOLLOWING ROUTES ARE SUPER ROUGH AND NOT IN WHATSOEVER MADE FOR REGAN....SORRY.
//gets a specific item, the string will be substituted for req.params.itemid or whatever regan sends it
  app.get('/ebay/getitem', function(req, res){
    daEbay.getEbayItem('110154759051', function(err, body){
      if(err){
        console.log(err);
      }
      res.json(body);
    });
  });
//gets an items quantity, will be passed ItemID
  app.get('/ebay/item/count', function(req, res){
    daEbay.getEbayItemCount('loool', function(err, body){
      if(err){
        console.log(err);
      }
      res.json(body);
    });
  });

//gets a users ebay information, string will be substituted for req.params.ebay.authToken 
  app.get('/ebay/userinfo', function(req, res){
    daEbay.getUsersEbayInfo('authtoken', function(err, body){
      if(err){
        console.log(err);
      }
      res.json(body);
    });
  });

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
    res.redirect('/api/etsy/getListings');
  });

  app.get('/api/etsy/getItemCount',function(req, res){
    bEtsy.getItemCount('216614188', function(err, body){
      if(err){
        console.log(err);
      }
      res.json(body.count);
    });
  });


  app.post('/api/etsy/items/:itemId', function(req, res){
    console.log("We're trying to update item #"+req.params.itemId);
    Item.findOne({_id:req.params.itemId}, function(err, item){
      if (err) { 
        return err;
      }
      else{
        console.log(item);
        bEtsy.updateItemCount(item.etsy.listingId, req.body.stock, function(err, body){
          if (err) { 
            return err;
          }
          else{
            item.stock = body.results[0].quantity;
            console.log(body.results[0].quantity);
            item.etsy.stock = body.results[0].quantity;
            console.log(item.etsy.stock);
            updateItem(item, function(err2,item){
              if (err2 || !item){
                  console.log('error updating item: ',err2);
              }else{
                  console.log('item updated: ', item);
              }
            })
          }
        });
          // update item quantity, will pass item id, quantity, and price
          console.log("Before ebay");
        daEbay.updateEbayItemCount(item.ebay.ItemID, req.body.stock, item.ebay.price, function(err, body){
          if(err){
            return err;
          }
          else{
            item.ebay.quantity = body.Quantity;
            updateItem(item, function(err2,item){
              if (err2 || !item){
                  console.log('error updating item: ',err2);
              }else{
                  console.log('item updated: ',item.name);
              }
            })
          }
        });
      }
    });
  });



  app.get('/api/etsy/getListings',function(req, res){
    bEtsy.getAllListings(req, res, function(err, body) {
      if (err) {
        return err;
      }
      else {
        return body;
      }
    });
    res.redirect('/#/dashboard');
  });
  //gets all items associated with a user, string will be substituted for req.params.ebay.authToken 
  app.get('/ebay/allitems', function(req, res){
    daEbay.getAllEbayListings('authtoken', function(err, body){
      if(err){
        return(err);
      }
      else{
        res.json(body);
      }
    });
    res.redirect('/#/dashboard');
  });
 

  app.get('/api/items', function(req, res, next) {
    var Item = mongoose.model('Item');
    Item.find(function(err, items){
      if(err){ return next(err); }
      res.json(items);
    });
  });

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
  });

  app.get('/api/users', function (req, res, next) {
    if (!req.headers['x-auth']) {
      return res.sendStatus(401)
    }
    var auth = jwt.decode(req.headers['x-auth'], config.secret)
    User.findOne({username: auth.username}, function (err, user) {
      if (err) { return next(err) }
      res.json(user)
    })
  });

  app.post('/api/users', function(req, res, next) {
    var user = new User({username: req.body.username})
    bcrypt.hash(req.body.password, 10, function (err, hash){
      if (err) {return next (err)}
      user.password = hash
      user.save(function (err){
        res.send(201)
      })
    })
  });
};




