var express = require('express');
var session = require('express-session');
var etsyjs = require('etsy-js');
var Constants = require('../constants');
var etsy = require('./etsy');
var mongoose = require('mongoose');


var standardCallback = function (err, status, body, headers, callback) {
  if (err) {
    console.log(err);
    return callback(err, null);
  }

  if (body) {
    // console.dir(body);
    return callback(null, body);  // this gives me an error
  }
} 


// var getAllListings = function(req, res, callback){
//   var Item = mongoose.model('Item');
//   var listingsParams = {
//     include_private: true,
//     includes: ['MainImage']
//   }

//   etsy.auth().get(
//     '/shops/'+etsy.shop+'/listings/active', 
//     listingsParams, 
//     function(err, status, body, headers){


//       var newi = new Item({name: body.results[0].title, stock: body.results[0].quantity, image: body.results[0].MainImage.url_75x75, owner: "54908d73f65054d8285b967e", 
//         etsy:{listingId: body.results[0].listing_id, stock: body.count}});
//       newi.save(function(err){
//         if (err) return handError(err);
//       });

//       standardCallback(err, status, body, headers, callback);
//     }
//   );
//   // console.dir(body);
// }; 

var getAllListings = function(req, res, callback){
  var Item = mongoose.model('Item');
  var listingsParams = {
    include_private: true,
    includes: ['MainImage']
  }

  etsy.auth().get(
    '/shops/'+etsy.shop+'/listings/active', 
    listingsParams, 
    function(err, status, body, headers){

      for(var i = 0; i <body.results.length; i++){
        var newi = new Item({name: body.results[i].title, stock: body.results[i].quantity, image: body.results[i].MainImage.url_75x75, owner: "54908d73f65054d8285b967e", 
          etsy:{listingId: body.results[i].listing_id, stock: body.count}});
        newi.save(function(err){
          if (err) return handError(err);
        });
      }

      standardCallback(err, status, body, headers, callback);
    }
  );
  // console.dir(body);
};


//will pass in ...shop and listing id? 
var getItemCount = function(itemID, callback){
  var listing = "214898873";
  etsy.getClient().get('/listings/'+itemID, function(err, status, body, headers){
    return body.count;
  });
};

var updateItemCount = function(itemId, stockCount, callback){
  var listing = "214898873"; //itemId
  //var stockInt = parseInt(stockCount, 10);
  console.log(stockCount);
  var update = {
    quantity: stockCount
  };
  // Item.findOne({ id: itemID }, function(err, thing) {
  //   if (err) return console.error(err);
  //     console.dir(thing);
  // });
  etsy.auth().put('/listings/'+itemId, update, function(err,status,body,headers){
    standardCallback(err,status,body,headers,callback);
  });
};


// will pass in session username
// pass in username from origin. 
var getUsersEtsyInfo = function(req, res, callback){
    etsy.auth().user(etsy.username).addresses(function(err, status, body, headers) {
      standardCallback(err, status, body, headers, callback);   
    });
};

module.exports = {
    getUsersEtsyInfo: getUsersEtsyInfo,
    getAllListings: getAllListings,
    getItemCount: getItemCount,
    updateItemCount: updateItemCount
};
