var express = require('express');
var session = require('express-session');
var etsyjs = require('etsy-js');
//What functions does this module need. 
// hard code token
// buddhaetsy.updateItemCount
// buddhaetsy.getItemCount
// buddhaetsy.getAllListings
// buddhaetsy.getUsersEtsyInfo


// var req.session.sec = '109b42c151';
// var req.session.token = 'd7901d140b48afbac82b6f8928b34d';


var client = etsyjs.client({
    key: 'glv40yg7ycl6czknj4f9v0xw',
    secret: 'w1udrm2cuk',
    callbackURL: 'http://localhost:3000/authorise'
});
var shop = "buddhabarapp";
var username= "donaldballard1"

//will pass in real shop name
var getAllListings = function(req, res, callback){
  var listings = {
      include_private: true
  }

  client.auth('d7901d140b48afbac82b6f8928b34d', '109b42c151').get('/shops/'+shop+'/listings/active', listings, function(err, status, body, headers){
    if (err) {
      console.log(err);
      return callback(err);
    }
    if (body) {
      console.dir(body);
      return callback(null, body);
    } else {
      return callback("Not Authorized");
    }
  });
};

//will pass in ...shop and listing id? 
var getItemCount = function(req, res, callback){
  var listing = "214898873";
  client.get('/listings/'+listing, function(err, status, body, headers){
    console.log(body.count);
  });
};

var updateItemCount = function(req, res, callback){
  var listing = "214898873";
  var update = {
    quantity: 2
  };
  client.auth('d7901d140b48afbac82b6f8928b34d', '109b42c151').put('/listings/'+listing,update, function(err,status,body,headers){
    if (err) {
      console.log(err);
    }
    if (body) {
      console.dir(body);
    }
    if (body) {
      return res.send(body.results[0]);
    }
  });
};
//will pass in session username
var getUsersEtsyInfo = function(req, res, callback){
    client.auth('d7901d140b48afbac82b6f8928b34d', '109b42c151').user(username).addresses(function(err, body, headers) {
      if (err) {
        console.log(err);
        return callback(err);
      }
      if (body) {
          console.dir(body);
          return callback(null, body);
      } 
      else {
          return callback("Not Authorized");
      }     
    });
};


//one way of defining exports
// var _getUsersEtsyInfo = function(req, res, next) {
//     some shit here.
// };
module.exports = {
    getUsersEtsyInfo: getUsersEtsyInfo,
    getAllListings: getAllListings,
    getItemCount: getItemCount,
    updateItemCount: updateItemCount
};



// var getImage = function(){
      //   client.get('/shops/buddhabarapp/214898873/image', {}, function (err, status, body, headers) {
      //     console.log(body); //json object
      //   });
      // };
      // getImage();

// var myFunction = function(param1, param2, ..., callback) {


// }