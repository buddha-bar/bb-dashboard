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
// // passing the objects required to update each store and each field. 
  function updateItem(item, cb){
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

completed = [];
function run() {
Item.find({}, function(err, items){
  items.forEach(function(item){
    pollQuantities(item);
  })
})
var pollQuantities = function(item){
  bEtsy.getItemCount(item.etsy.listingId, function(err, body){
    if(err){
      return (err);
    }else{
      var currentEtsyStock = body.results[0].quantity;
          if(item.etsy.stock != currentEtsyStock){
            daEbay.updateEbayItemCount(item.ebay.ItemID, currentEtsyStock, item.ebay.price, function(err, body){
              if (err){
                return err;
              }else{
                item.stock = currentEtsyStock;
                item.etsy.stock = currentEtsyStock;
                item.ebay.quantity = currentEtsyStock;
                console.log("before update: ", item);
                updateItem(item, function(err, result){
                  if (err) {
                    console.log(err);
                  }else{
                    console.log(result.stock, result.etsy.stock, result.ebay.quantity);
                  }
                });
              }
            });
        }
      }
  });
}
}


//   function run() {
//     console.log("Inside run()");
//     Item.find({},function(err, items){
//       console.log("Items found:", items);
//       async.mapSeries(items, check, function(err, results) {
//         if (err) {
//           console.log(err);
//         }else{
//           return (results);
//         }
//       });
//     });
//   };
//   function check(item, callback){
//     var element = item.name;
//     var idx = completed.indexOf(element);
//     // if (completed.length == 5){
//     //   completed = [];
//     //   callback("It's fucking done");
//     // }
//     if (idx != -1){
//       callback("It's fucking there");
//     }else{
//       fetchOne(item, function(err, result){
//         if(err){
//           console.log("I got an error: ", err);
//           callback(err);
//         }else{
//           callback(null, result);
//         }
//       });
//     } 
//   };

//   function fetchOne(itemO, cb) {
//     async.waterfall([
//       //function(callback){ //gets passed user.item.id 
//           //going to return the items information for etsy and for amazon and store that into separate variables
//           //including: etsy store, listing id, inventory count,  authentication info
//           // amazon store, listing id, inventory count,authentication info 
//           // passes necessary info for api request to pull function
//       //   Item.findOne({ name: item.name}, function(err, itemO){
//       //     if (err) {
//       //       callback(err);
//       //     }
//       //     else {
//       //       callback(null, itemO);
//       //     }
//       //   })
//       // },
//       function(callback){
//         // receives etsy and amazon item listing and auth params (thing)
//         var element = itemO.name;
//         var idx = completed.indexOf(element);
//         if (idx != -1){
//           callback(true);
//         }else{
//           bEtsy.getItemCount(itemO.etsy.listingId, function(err, body){
//             if(err){
//               callback(err);
//             }else {
//               console.log("etsy item count:", body.results[0].quantity, "for:", itemO.name );
//             //if (body.results[0].quantity < itemO.etsy.stock) {
//               var currentEtsyStock = body.results[0].quantity;
//               callback(null, itemO, currentEtsyStock);
//             }
//           });
//         }
//       },
//       function(itemO, currentEtsyStock, callback){
//         var element = itemO.name;
//         var idx = completed.indexOf(element);
//         if (idx != -1){
//           callback(true);
//         }else{
//           console.log("getting ebay item for:", itemO.name);
//           daEbay.getEbayItemCount(itemO.ebay.ItemID, function(err, body2){
//             if(err){
//               callback("error:", err);
//             }else{
//               //console.log("etsy item count:", body2.Item.quantity, "for:", itemO.name );
//               var currentEbayStock = body2.Item.Quantity;
//               callback(null, itemO, currentEtsyStock, currentEbayStock);
//             }
//           });
//         }
//       },
//       function(itemO, currentEtsyStock, currentEbayStock, callback){
//         var element = itemO.name;
//         var idx = completed.indexOf(element);
//         if (idx != -1){
//           callback(true);
//         }else{
//           completed.push(itemO.name);
//           itemO.stock -= ((itemO.stock - currentEtsyStock) + (itemO.stock - currentEbayStock));
//           itemO.etsy.stock = itemO.stock;
//           itemO.ebay.quantity = itemO.stock;
//           updateItem(itemO, function(err2,item){
//             if (err2 || !item){
//               console.log('error updating item: ',err2);
//               callback(err2);
//             }
//             else{
//                   console.log('item updated: ', item.name);
//                   callback(null, item);
//             }
//           })
//         }
//       },
//       // function(item, callback){
//       //   bEtsy.updateItemCount(item.etsy.listingId, item.stock, function(err, body){
//       //     if (err) { 
//       //       //return next(err); 
//       //       callback(err);
//       //     }else{
//       //       console.log("etsy update successful");
//       //       callback(null, item);
//       //     }
//       //   });
//       // },
//       function(item, callback){
//         var element = item.name;
//         var idx = completed.indexOf(element);
//         if (idx != -1){
//           console.log("Found");
//           callback(true);
//         }else{
//           console.log("not found");
//           daEbay.updateEbayItemCount(item.ebay.ItemID, item.stock, item.ebay.price, function(err, body){
//             if(err){
//               console.log("error happened in updateEbayItemCountPULLERRR");
//               console.log(err);
//               callback(err, item);
//             }
//             else{ 
//               uniq(completed);
//               function uniq(a) {
//                 var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];
//                 return a.filter(function(item) {
//                 var type = typeof item;
//                 if(type in prims)
//                   return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
//                 else
//                   return objs.indexOf(item) >= 0 ? false : objs.push(item);
//                   });
//                 }
//               console.log("ebay update successful for: ", item.name);
//               callback(null, item);
//             }
//           });
//         }
//       }
//     ],
//     function(err, item) {
//       console.log(completed);
//       //console.log(itemO.name, item.etsy.stock, item.ebay.quantity);
//       console.log("Done Waterfall with:");
//       cb(null, item);
//     }); // async.waterfall
//   }; // function fetch()

//setInterval(run, 20000);
// console.log("Ran");

