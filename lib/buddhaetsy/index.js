var express = require('express');
var session = require('express-session');
var etsyjs = require('etsy-js');
var Constants = require('../constants');
var etsy = require('./etsy');

var standardCallback = function (err, status, body, headers, callback) {
  if (err) {
    console.log(err);
    return callback(err, null);
  }

  if (body) {
    console.dir(body);
    return callback(null, body);
  }
} 

//will pass in real shop name
var getAllListings = function(req, res, callback){
  var listingsParams = {
    include_private: true
  }

  etsy.auth().get(
    '/shops/'+etsy.shop+'/listings/active', 
    listingsParams, 
    function(err, status, body, headers){
      standardCallback(err, status, body, headers, callback);
    }
  );
};  

//will pass in ...shop and listing id? 
var getItemCount = function(req, res, callback){
  var listing = "214898873";

  etsy.getClient().get('/listings/'+listing, function(err, status, body, headers){
    return body.count;
  });
};

var updateItemCount = function(req, res, callback){
  var listing = "214898873";
  var update = {
    quantity: 2
  };

  etsy.auth().put('/listings/'+listing, update, function(err,status,body,headers){
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
