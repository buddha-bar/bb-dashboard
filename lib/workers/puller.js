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
  }

  function run() {
    Item.find({},function(err, items){
        // [Item1, Item2, Item3]
      async.map(items, fetchOne, function(err, results) {
        console.log(err);
        // [Result1, Result2, Result3]
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
        Item.findOne({ name: item.name}, function(err, itemO){
          if (err) {
            callback(err);
          }
          else {
            callback(null, itemO);
          }
        })
      },
      function(itemO, callback){
          // receives etsy and amazon item listing and auth params (thing)
              bEtsy.getItemCount(itemO.etsy.listingId, function(err, body){
                if(err){
                  console.log(err);
                  callback(err);
                }
                if (body.results[0].quantity < itemO.etsy.stock) {
                  // itemO.stock = body.results[0].quantity;
                  // itemO.etsy.stock = body.results[0].quantity;
                  //   updateItem(itemO, function(err, item){
                  //   if (err || !item) {
                  //     console.log("error saving item", err);
                  //   } else {
                  //     console.log("item saved!");
                  //     console.log(item.etsy.stock, item.stock);
                  //     callback(null,item)
                  //   }
                  // })
                  var currentEtsyStock = body.results[0].quantity;
                  daEbay.getEbayItemCount(itemO.ebay.ItemID, function(err, body2){
                    if(err){
                      console.log(err);
                    }
                    var currentEbayStock = body2;
                    console.log("currentEbayStock:", currentEbayStock);
                    console.log("currentEtsyStock:", currentEtsyStock);
                    callback(null, itemO, currentEtsyStock, currentEbayStock);
                  });
                }
              });
        // getAmazonItemCount(Thing.amazon.id)
        // var getAmazonItemCount = function(){};
        //  process(etsyCount, amazonCount, thing);
        // saves etsy info and amazon inventory info into variables. 
        // passes counts (at least) to process function. 
      
    },
    function(itemO, currentEtsyStock, currentEbayStock, callback){
      console.log(itemO);
      console.log("update currentEtsyStock:", currentEtsyStock);
      console.log("update currentEbayStock:", currentEbayStock);
        itemO.stock -= ((itemO.stock - currentEtsyStock) + (itemO.stock - currentEbayStock));
        itemO.etsy.stock = itemO.stock;
        itemO.ebay.stock = itemO.stock;
        updateItem(itemO, function(err2,item){
          if (err2 || !item){
            console.log('error updating item: ',err2);
          }else{
            console.log('item updated: ', item);
            callback(null, item);
          }
        })
    },
    function(item, callback){
      bEtsy.updateItemCount(item.etsy.listingId, item.stock, function(err, body){
        if (err) { 
          //return next(err); 
          return err;
        }
        console.log("etsy update successful");
        daEbay.updateEbayItemCount(item.ebay.ItemID, item.stock, function(err, body){
          if(err){
            console.log(err);
          }
          console.log("ebay update successful");
          callback(null, item);
        });
      });
    }],
      function(err, result) {
        console.log(result.stock, result.etsy.stock, result.ebay.quantity);
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
  }; // function fetch()
//setInterval(run, 30000);

