//to require
var express = require('express');
var session = require('express-session');
var http = require('http');
var util = require('util');
var ebay = require('ebay-api');
var readline = require('readline');
var mongoose = require('mongoose');
var Item = mongoose.model('Item');

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

var getEbayItemCount = function(ItemID, callback){
  console.log("getEbayItemCount:", ItemID);
  ebay.ebayApiPostXmlRequest({
    serviceName : 'Trading',
    opType : 'GetItem',
    
    devName: '8fa0915f-a719-429f-9b67-1a0825b294b8',
    cert: 'a21903b2-fd17-4453-835e-4c44ea3dc2c7',
    appName: 'DonaldBa-57d8-4a4e-9a01-7aca78e78907',
    
    sandbox: true,
    
    params: {
      'authToken':'AgAAAA**AQAAAA**aAAAAA**TYGgVA**nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6wFk4GhDZCLqQqdj6x9nY+seQ**cysDAA**AAMAAA**Ssea6bYMpvF7m7Txw6Enm4aBQa2P7lnTfNu9v3nJXnkrCOnbDiGZITFhN7aMO+h5Eu/5aMgKa3q5Wv0GXd82ODt/h9VNAkqGSczDko0IxYrBQS7H63w4+uWS1pjxmHDjQgmNFemcmvmcCNkqEvA0/Hfjc1V11QG+DhJcFh02H6lm8izWe993WUoTOkU0rSDm/lVSupe6Neb5A07li8QOw+XlJM33UXPROui40xLuV6X3CkxYWoTIbWYY33sj2BUoXosaLN53Xoux9XRuiKG2sJrwTmpPzjsH414a6cBsNsO0xxMX/wVk5SZ9uIJq7z6uvx5m+kZmtzWshuERk+VwuOrjaequ4jXiIkdUjbZBHJGP50GvP6gesedkEFjEYL3lCc7FpoT3cpoR+RXoXu6JB5Iar8JZ8D1VhnochlSAp0ZK199W7uTgVyYwUtXs38OwIZ041kxjQ6TIMwSygkImaFapsjbbTCc1UFJ0YpB4ZH1KyemFSfR8F9MB376ojIJDyk/35rUUDgQ0cWvkORStU8Lb66+bZtB7PwfSL7UfdehHMFPYami7tZdyizxB/NozyMfaLd7cak0lupMUq0ooR+O8aig1fKcBfCBqQorrcT0RIx8HXxT875/4fC+l7Dzv4vFXuuN8GsupZpzPt9gTchBX2nLbw4Xze1J+irpW6QjwhgVvDaE8UODVnAROxfwLQ4FtIH44f1SCeBE5F/iMIF2chJt8U7T5dAN65A0anDfvnDnDibUsVZTsLmDT2HDE',
      'ItemID': ItemID,
    }
    
  }, 
  function(error, results){
    if (error) {
      callback(error);
    }
    else{
      console.log("sending result back to puller from ebay with: ");
      console.log(results.Item.Title);
      callback(null, results);
    }
  });
  //callback(result.Item.Quantity);
};

var getEbayItem = function (ItemID, callback){
  ebay.ebayApiPostXmlRequest({
      serviceName : 'Shopping',
      opType : 'GetSingleItem',
      
      // devName: '8fa0915f-a719-429f-9b67-1a0825b294b8',
      // cert: 'a21903b2-fd17-4453-835e-4c44ea3dc2c7',
      appId: 'DonaldBa-57d8-4a4e-9a01-7aca78e78907',
      
      sandbox: true,
      
      params: {
        'authToken':'AgAAAA**AQAAAA**aAAAAA**TYGgVA**nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6wFk4GhDZCLqQqdj6x9nY+seQ**cysDAA**AAMAAA**Ssea6bYMpvF7m7Txw6Enm4aBQa2P7lnTfNu9v3nJXnkrCOnbDiGZITFhN7aMO+h5Eu/5aMgKa3q5Wv0GXd82ODt/h9VNAkqGSczDko0IxYrBQS7H63w4+uWS1pjxmHDjQgmNFemcmvmcCNkqEvA0/Hfjc1V11QG+DhJcFh02H6lm8izWe993WUoTOkU0rSDm/lVSupe6Neb5A07li8QOw+XlJM33UXPROui40xLuV6X3CkxYWoTIbWYY33sj2BUoXosaLN53Xoux9XRuiKG2sJrwTmpPzjsH414a6cBsNsO0xxMX/wVk5SZ9uIJq7z6uvx5m+kZmtzWshuERk+VwuOrjaequ4jXiIkdUjbZBHJGP50GvP6gesedkEFjEYL3lCc7FpoT3cpoR+RXoXu6JB5Iar8JZ8D1VhnochlSAp0ZK199W7uTgVyYwUtXs38OwIZ041kxjQ6TIMwSygkImaFapsjbbTCc1UFJ0YpB4ZH1KyemFSfR8F9MB376ojIJDyk/35rUUDgQ0cWvkORStU8Lb66+bZtB7PwfSL7UfdehHMFPYami7tZdyizxB/NozyMfaLd7cak0lupMUq0ooR+O8aig1fKcBfCBqQorrcT0RIx8HXxT875/4fC+l7Dzv4vFXuuN8GsupZpzPt9gTchBX2nLbw4Xze1J+irpW6QjwhgVvDaE8UODVnAROxfwLQ4FtIH44f1SCeBE5F/iMIF2chJt8U7T5dAN65A0anDfvnDnDibUsVZTsLmDT2HDE',
        'ItemID': ItemID,
      }
      
    }, function(error, results) {
      if (error) {
        console.log(error);
      }
      console.log(results);
  });
};

var getAllEbayListings = function(authToken, callback){
  var Pagination = {
    Entries: 5,
    PageNumber: 1
  }
  ebay.ebayApiPostXmlRequest({
    serviceName : 'Trading',
    opType : 'GetSellerList',
    
    devName: '8fa0915f-a719-429f-9b67-1a0825b294b8',
    cert: 'a21903b2-fd17-4453-835e-4c44ea3dc2c7',
    appName: 'DonaldBa-57d8-4a4e-9a01-7aca78e78907',
    
    sandbox: true,
    //   pages: pages,
    // perPage: perPage,
    params: {
      'authToken':'AgAAAA**AQAAAA**aAAAAA**TYGgVA**nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6wFk4GhDZCLqQqdj6x9nY+seQ**cysDAA**AAMAAA**Ssea6bYMpvF7m7Txw6Enm4aBQa2P7lnTfNu9v3nJXnkrCOnbDiGZITFhN7aMO+h5Eu/5aMgKa3q5Wv0GXd82ODt/h9VNAkqGSczDko0IxYrBQS7H63w4+uWS1pjxmHDjQgmNFemcmvmcCNkqEvA0/Hfjc1V11QG+DhJcFh02H6lm8izWe993WUoTOkU0rSDm/lVSupe6Neb5A07li8QOw+XlJM33UXPROui40xLuV6X3CkxYWoTIbWYY33sj2BUoXosaLN53Xoux9XRuiKG2sJrwTmpPzjsH414a6cBsNsO0xxMX/wVk5SZ9uIJq7z6uvx5m+kZmtzWshuERk+VwuOrjaequ4jXiIkdUjbZBHJGP50GvP6gesedkEFjEYL3lCc7FpoT3cpoR+RXoXu6JB5Iar8JZ8D1VhnochlSAp0ZK199W7uTgVyYwUtXs38OwIZ041kxjQ6TIMwSygkImaFapsjbbTCc1UFJ0YpB4ZH1KyemFSfR8F9MB376ojIJDyk/35rUUDgQ0cWvkORStU8Lb66+bZtB7PwfSL7UfdehHMFPYami7tZdyizxB/NozyMfaLd7cak0lupMUq0ooR+O8aig1fKcBfCBqQorrcT0RIx8HXxT875/4fC+l7Dzv4vFXuuN8GsupZpzPt9gTchBX2nLbw4Xze1J+irpW6QjwhgVvDaE8UODVnAROxfwLQ4FtIH44f1SCeBE5F/iMIF2chJt8U7T5dAN65A0anDfvnDnDibUsVZTsLmDT2HDE',
      //'EndTimeFrom': '2015-01-07T12:00:00.000Z',
      //'EndTimeTo': '2015-04-07T15:46:00.000Z',
      'StartTimeFrom':'2015-01-07T12:00:00.000Z',
      'StartTimeTo':'2015-01-20T15:46:00.000Z',
      'DetailLevel':'ReturnAll',
      'Pagination': Pagination
      // 'OrderStatus': 'Active',
      // 'NumberOfDays': 1
    }
    
  }, function(error, results) {
    if (error) {
      return (error);
    }
    if (results.ItemArray){
      results.ItemArray.Item.forEach(function(result){
        Item.findOne({ name: result.Title }, function(err, ite){

            if (err) {
              console.log("error finding the item", err);
            }

            if (ite) {
              ite.name = result.Title;
              ite.stock = result.Quantity;
              //ite.image = result.ListingDetails.ViewItemURL;
              ite.owner = "54908d73f65054d8285b967e";
              ite.ebay.ItemID = result.ItemID;
              ite.ebay.quantity = result.Quantity;
              ite.ebay.image = result.ListingDetails.ViewItemURL;
              ite.ebay.store = "true";
              ite.ebay.price = result.StartPrice["#"];
              updateItem(ite, function(err2,item){
                if (err2 || !item){
                    console.log('error updating item: ',err2);
                }else{
                    console.log('item updated: ');
                }
              })
            }else{
              var newi = new Item({
                    name: result.Title, 
                    stock: result.Quantity, 
                    image: result.ListingDetails.ViewItemURL, 
                    owner: "54908d73f65054d8285b967e", 
                    ebay:{
                      ItemID: result.ItemID, 
                      quantity: result.Quantity,
                      image: result.ListingDetails.ViewItemURL,
                      ebaystore: "true",
                      price: result.StartPrice["#"] + "0"
                    }
                  })
              newi.save(function(err){
                if (err) {
                  console.log("error saving item", err);
                } else {
                  console.log("item saved!");
                }
              })
            } 
          })
        })
      }
    }
  )
};
// function(err, status, body, headers){
//       body.results.forEach(function(result){
//         Item.findOne({ name: result.title }, function(err, ite){

//           if (err) {
//             console.log("error finding the item", err);
//           }

//           if (ite) {
//             ite.name = result.title;
//             ite.stock = result.quantity;
//             ite.image = result.MainImage.url_75x75;
//             ite.owner = "54908d73f65054d8285b967e";
//             ite.etsy.listingId = result.listing_id;
//             ite.etsy.stock = result.quantity;
//             updateItem(ite, function(err2,item){
//               if (err2 || !item){
//                   console.log('error updating item: ',err2);
//               }else{
//                   console.log('item updated: ', item);
//               }
//             })
//           }else{
//             var newi = new Item({
//                   name: result.title, 
//                   stock: result.quantity, 
//                   image: result.MainImage.url_75x75, 
//                   owner: "54908d73f65054d8285b967e", 
//                   etsy:{
//                     listingId: result.listing_id, 
//                     stock: result.quantity
//                   }});
//             newi.save(function(err){
//               if (err) {
//                 console.log("error saving item", err);
//               } else {
//                 console.log("item saved!");
//               }
//             })
//           } 
//         })
//       })
//     }
//};

var getUsersEbayInfo = function(authToken, callback){
  ebay.ebayApiPostXmlRequest({
    serviceName : 'Trading',
    opType : 'GetUser',
    
    devName: '8fa0915f-a719-429f-9b67-1a0825b294b8',
    cert: 'a21903b2-fd17-4453-835e-4c44ea3dc2c7',
    appName: 'DonaldBa-57d8-4a4e-9a01-7aca78e78907',
    
    sandbox: true,
    
    params: {
    'authToken':'AgAAAA**AQAAAA**aAAAAA**TYGgVA**nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6wFk4GhDZCLqQqdj6x9nY+seQ**cysDAA**AAMAAA**Ssea6bYMpvF7m7Txw6Enm4aBQa2P7lnTfNu9v3nJXnkrCOnbDiGZITFhN7aMO+h5Eu/5aMgKa3q5Wv0GXd82ODt/h9VNAkqGSczDko0IxYrBQS7H63w4+uWS1pjxmHDjQgmNFemcmvmcCNkqEvA0/Hfjc1V11QG+DhJcFh02H6lm8izWe993WUoTOkU0rSDm/lVSupe6Neb5A07li8QOw+XlJM33UXPROui40xLuV6X3CkxYWoTIbWYY33sj2BUoXosaLN53Xoux9XRuiKG2sJrwTmpPzjsH414a6cBsNsO0xxMX/wVk5SZ9uIJq7z6uvx5m+kZmtzWshuERk+VwuOrjaequ4jXiIkdUjbZBHJGP50GvP6gesedkEFjEYL3lCc7FpoT3cpoR+RXoXu6JB5Iar8JZ8D1VhnochlSAp0ZK199W7uTgVyYwUtXs38OwIZ041kxjQ6TIMwSygkImaFapsjbbTCc1UFJ0YpB4ZH1KyemFSfR8F9MB376ojIJDyk/35rUUDgQ0cWvkORStU8Lb66+bZtB7PwfSL7UfdehHMFPYami7tZdyizxB/NozyMfaLd7cak0lupMUq0ooR+O8aig1fKcBfCBqQorrcT0RIx8HXxT875/4fC+l7Dzv4vFXuuN8GsupZpzPt9gTchBX2nLbw4Xze1J+irpW6QjwhgVvDaE8UODVnAROxfwLQ4FtIH44f1SCeBE5F/iMIF2chJt8U7T5dAN65A0anDfvnDnDibUsVZTsLmDT2HDE',
    }
    
    }, function(error, results) {
    if (error) {
      console.dir(error);
      process.exit(1);
    }
    console.dir(results.User);
  });
};

var updateEbayItemCount = function(itemID, quantity, price, cb){
  console.log("updating ebay item count for: ", itemID);
  var Item = new Object({
    ItemID: itemID,
    StartPrice: price,
    Quantity: quantity
  });
  ebay.ebayApiPostXmlRequest({
    serviceName : 'Trading',
    opType : 'ReviseItem',
    
    devName: '8fa0915f-a719-429f-9b67-1a0825b294b8',
    cert: 'a21903b2-fd17-4453-835e-4c44ea3dc2c7',
    appName: 'DonaldBa-57d8-4a4e-9a01-7aca78e78907',
    sandbox: true,
    params: {
      'authToken':'AgAAAA**AQAAAA**aAAAAA**TYGgVA**nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6wFk4GhDZCLqQqdj6x9nY+seQ**cysDAA**AAMAAA**Ssea6bYMpvF7m7Txw6Enm4aBQa2P7lnTfNu9v3nJXnkrCOnbDiGZITFhN7aMO+h5Eu/5aMgKa3q5Wv0GXd82ODt/h9VNAkqGSczDko0IxYrBQS7H63w4+uWS1pjxmHDjQgmNFemcmvmcCNkqEvA0/Hfjc1V11QG+DhJcFh02H6lm8izWe993WUoTOkU0rSDm/lVSupe6Neb5A07li8QOw+XlJM33UXPROui40xLuV6X3CkxYWoTIbWYY33sj2BUoXosaLN53Xoux9XRuiKG2sJrwTmpPzjsH414a6cBsNsO0xxMX/wVk5SZ9uIJq7z6uvx5m+kZmtzWshuERk+VwuOrjaequ4jXiIkdUjbZBHJGP50GvP6gesedkEFjEYL3lCc7FpoT3cpoR+RXoXu6JB5Iar8JZ8D1VhnochlSAp0ZK199W7uTgVyYwUtXs38OwIZ041kxjQ6TIMwSygkImaFapsjbbTCc1UFJ0YpB4ZH1KyemFSfR8F9MB376ojIJDyk/35rUUDgQ0cWvkORStU8Lb66+bZtB7PwfSL7UfdehHMFPYami7tZdyizxB/NozyMfaLd7cak0lupMUq0ooR+O8aig1fKcBfCBqQorrcT0RIx8HXxT875/4fC+l7Dzv4vFXuuN8GsupZpzPt9gTchBX2nLbw4Xze1J+irpW6QjwhgVvDaE8UODVnAROxfwLQ4FtIH44f1SCeBE5F/iMIF2chJt8U7T5dAN65A0anDfvnDnDibUsVZTsLmDT2HDE',
      'Item':Item
    }
    
  }, function(error, results) {
    if (error) {
      console.log("Error happened before sending to puller");
      cb(error);
    }else{
      console.log("update was successful ");
    cb(null, itemID);
    }
    //res.json(results);
  });
};
module.exports = {
  getEbayItemCount: getEbayItemCount,
  getEbayItem: getEbayItem,
  getAllEbayListings: getAllEbayListings,
  getUsersEbayInfo: getUsersEbayInfo,
  updateEbayItemCount: updateEbayItemCount
};