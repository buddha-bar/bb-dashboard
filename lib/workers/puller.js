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

        item.save(function(err){
          cb(err,item);
        });
  }

  function run() {
    console.log("Inside run()");
    Item.find({name: "Foodie Dice"},function(err, items){
      console.log("Items found:", items);
      async.mapSeries(items, fetchOne, function(err, results) {
        if (err) console.log(err);
        console.log("Async Map Results:", results);
      });
    });
  };

  function fetchOne(itemO, cb) {
    async.waterfall([
      //function(callback){ //gets passed user.item.id 
          //going to return the items information for etsy and for amazon and store that into separate variables
          //including: etsy store, listing id, inventory count,  authentication info
          // amazon store, listing id, inventory count,authentication info 
          // passes necessary info for api request to pull function
      //   Item.findOne({ name: item.name}, function(err, itemO){
      //     if (err) {
      //       callback(err);
      //     }
      //     else {
      //       callback(null, itemO);
      //     }
      //   })
      // },
      function(callback){
        // receives etsy and amazon item listing and auth params (thing)
        console.log("getting etsy item for:", itemO.name);
        bEtsy.getItemCount(itemO.etsy.listingId, function(err, body){
          if(err){
            callback(err);
          }else {
          //if (body.results[0].quantity < itemO.etsy.stock) {
            var currentEtsyStock = body.results[0].quantity;
            callback(null, itemO, currentEtsyStock);
          }
        });
      },
      // function(callback){
      //   console.log("getting ebay item for:", itemO.name);
      //   daEbay.getEbayItemCount(itemO.ebay.ItemID, function(err, body2){
      //     if(err){
      //       callback(err);
      //     }else{
      //       var currentEbayStock = body2.Item.Quantity;
      //       callback(null, itemO, currentEbayStock);
      //     }
      //   });
      // },
      function(itemO, currentEtsyStock, callback){
        var currentItemStock = itemO.stock;
          //itemO.stock -= ((itemO.stock - currentEtsyStock) + (itemO.stock - currentEbayStock));
          itemO.etsy.stock = itemO.stock;
          itemO.ebay.quantity = itemO.stock;
          updateItem(itemO, function(err2,item){
            if (err2 || !item){
              console.log('error updating item: ',err2);
              callback(err2);
            }
            // if (currentItemStock == item.stock) {
            //       var code = 0;
            //       process.exit(code);
            //     }
            else{
                  console.log('item updated: ', item.name);
                  callback(null, item);
            }
          })
      },
      // function(item, callback){
      //   bEtsy.updateItemCount(item.etsy.listingId, item.stock, function(err, body){
      //     if (err) { 
      //       //return next(err); 
      //       callback(err);
      //     }else{
      //       console.log("etsy update successful");
      //       callback(null, item);
      //     }
      //   });
      // },
      function(item, callback){
        console.log("Before update in function", item.name);
        daEbay.updateEbayItemCount(item.ebay.ItemID, item.stock, item.ebay.price, function(err, body){
          console.log(item);
          if(err){
            console.log("error happened in updateEbayItemCountPULLERRR");
            callback(err, item);
          }
          else{
            console.log("ebay update successful");
            callback(null, item);
          }
        });
      }
    ],
    function(err, item) {
      //console.log(itemO.name, item.etsy.stock, item.ebay.quantity);
      console.log("Done Waterfall", item);
      cb(err, item);
    }); // async.waterfall
  }; // function fetch()

//run();
console.log("Ran");
//var intervalObject = setInterval(run, 60000);
