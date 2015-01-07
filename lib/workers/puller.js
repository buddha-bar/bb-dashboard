var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var url = require('url');
var etsyjs = require('etsy-js');
var mongoose = require('mongoose');
var bEtsy = require('../buddhaetsy');
var etsy = require('../buddhaetsy/etsy');
var ebay = require('ebay-api');
var daEbay = require('../buddhaebay');
var async = require('async');

var Item = mongoose.model('Item');

// This method will poll etsy, amazon, and the database for item counts and compare them.
//possibly loop through all items, like for user.items.length do: 

//mongoose populations...creating a schema for association in a no sql database
// consider having a sales that has a user and list of item id's 

// The realistic code is to create two loops, one for each user, one for the users items. 
// when all items have been updates, make a batch process for each user..so upder() lives outside of main and is called
// passing the objects required to update each store and each field. 
// async.waterfall([
//     async.apply(func1, "1")
// ], function (err, result) {

// });

// function func1(par1, callback) {
//     console.log(par1); // Outputs: 1
// }
  function updateItem(item,cb){
    Item.find({name : item.name}, function (err, docs) {
      console.log(item);
      if (err){
        cb('item exists already',null);
      }else{
        item.save(function(err){
          cb(err,item);
        });
      }
    });
  }

  function run() {
    Item.find({},function(err, items){
      // [Item1, Item2, Item3]
      async.map(items, fetchOne, function(err, results) {
        console.log(err);
        console.log(results); // [Result1, Result2, Result3]
        // done done.
      });
    });
  };


  function fetchOne(item) {
    async.waterfall([
      function(callback){ //gets passed user.item.id 
          //going to return the items information for etsy and for amazon and store that into separate variables
          //including: etsy store, listing id, inventory count,  authentication info
          // amazon store, listing id, inventory count,authentication info 
          // passes necessary info for api request to pull function
        console.log("before Item search", item.name);
        //Something like
        Item.findOne({ name: item.name}, function(err, itemO){
          if (err) {
            callback(err);
          }
          else {
            callback(null, itemO);
          }
        })
        // pull(thing);
      },
      function(itemO, callback){ // receives etsy and amazon item listing and auth params (thing)
        // var etsyCount = undefined;
        // var amazonCount = undefined;
        // var getItemCount = function(itemID, callback){
        //   var listing = "214898873";
        bEtsy.getItemCount(itemO.etsy.listingId, function(err, body){
          //console.log(body);
          //console.log(body.results[0].quantity);
          if(err){
            callback(err);
          }
          console.log(body.results[0].quantity, itemO.etsy.stock);
           if (body.results[0].quantity < itemO.etsy.stock) {
            itemO.stock = body.results[0].quantity;
            itemO.etsy.stock = body.results[0].quantity;
              updateItem(itemO, function(err, item){
              if (err || !item) {
                console.log("error saving item", err);
              } else {
                console.log("item saved!");
                console.log(item.etsy.stock, item.stock);
                callback(null,item)
              }
            })
          }
        });
          // if (ite) {
          //   ite.name = result.title;
          //   ite.stock = result.quantity;
          //   ite.image = result.MainImage.url_75x75;
          //   ite.owner = "54908d73f65054d8285b967e";
          //   ite.etsy.listingId = result.listing_id;
          //   ite.etsy.stock = result.quantity;
          //   updateItem(ite, function(err2,item){
          //     if (err2 || !item){
          //         console.log('error updating item: ',err2);
          //     }else{
          //         console.log('item updated: ', item);
          //     }
          //   })
          // }
        //   etsy.getClient().get('/listings/'+listing, function(err, status, body, headers){
        //      var etsyCount = body.count;
        //     
        //   });
        // };
        // getAmazonItemCount(Thing.amazon.id)
        // var getAmazonItemCount = function(){};
        //  process(etsyCount, amazonCount, thing);
        // saves etsy info and amazon inventory info into variables. 
        // passes counts (at least) to process function. 
      
    }],
      function(err, results) {
        console.log(results.name, results.stock, results.etsy.stock);
      //process: function () { // receive etsy.count and amazon.count and db.count
        //set db count relative to -= ((db - etsy) + (db - amazon))
        //set db.item.etsy.count and db.item.amazon.count
        //pass new count to push
        // if db.count > dbcount || db.count < dbcount
        //find one and update db.count to dbcount
        //push dbcount
      //}, 
      //update: function () { //receives new count/object info. , also has to have the item information from pull?
        //updates new count on etsy amazon and dashboard. 
        //
      //}
    });
  } // function fetch()
run();

