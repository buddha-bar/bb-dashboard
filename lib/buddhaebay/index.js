//to require
var express = require('express');
var session = require('express-session');
var http = require('http');
var util = require('util');
var ebay = require('ebay-api');
var readline = require('readline');
var mongoose = require('mongoose');
var getEbayItemCount = function(ItemID, callback){
  ebay.ebayApiPostXmlRequest({
    serviceName : 'Trading',
    opType : 'GetItem',
    
    devName: '8fa0915f-a719-429f-9b67-1a0825b294b8',
    cert: 'a21903b2-fd17-4453-835e-4c44ea3dc2c7',
    appName: 'DonaldBa-57d8-4a4e-9a01-7aca78e78907',
    
    sandbox: true,
    
    params: {
      'authToken':'AgAAAA**AQAAAA**aAAAAA**TYGgVA**nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6wFk4GhDZCLqQqdj6x9nY+seQ**cysDAA**AAMAAA**Ssea6bYMpvF7m7Txw6Enm4aBQa2P7lnTfNu9v3nJXnkrCOnbDiGZITFhN7aMO+h5Eu/5aMgKa3q5Wv0GXd82ODt/h9VNAkqGSczDko0IxYrBQS7H63w4+uWS1pjxmHDjQgmNFemcmvmcCNkqEvA0/Hfjc1V11QG+DhJcFh02H6lm8izWe993WUoTOkU0rSDm/lVSupe6Neb5A07li8QOw+XlJM33UXPROui40xLuV6X3CkxYWoTIbWYY33sj2BUoXosaLN53Xoux9XRuiKG2sJrwTmpPzjsH414a6cBsNsO0xxMX/wVk5SZ9uIJq7z6uvx5m+kZmtzWshuERk+VwuOrjaequ4jXiIkdUjbZBHJGP50GvP6gesedkEFjEYL3lCc7FpoT3cpoR+RXoXu6JB5Iar8JZ8D1VhnochlSAp0ZK199W7uTgVyYwUtXs38OwIZ041kxjQ6TIMwSygkImaFapsjbbTCc1UFJ0YpB4ZH1KyemFSfR8F9MB376ojIJDyk/35rUUDgQ0cWvkORStU8Lb66+bZtB7PwfSL7UfdehHMFPYami7tZdyizxB/NozyMfaLd7cak0lupMUq0ooR+O8aig1fKcBfCBqQorrcT0RIx8HXxT875/4fC+l7Dzv4vFXuuN8GsupZpzPt9gTchBX2nLbw4Xze1J+irpW6QjwhgVvDaE8UODVnAROxfwLQ4FtIH44f1SCeBE5F/iMIF2chJt8U7T5dAN65A0anDfvnDnDibUsVZTsLmDT2HDE',
      'ItemID': '110154759051',
    }
    
  }, function(error, results) {
    if (error) {
      console.dir(error);
      process.exit(1);
    }
    console.dir(results.Item.Quantity);
  });
};

var getEbayItem = function (ItemID, callback){
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
      
    }, function(error, results) {
      if (error) {
        console.dir(error);
        process.exit(1);
      }
      console.dir(results.Item.ListingType);
  });
};

var getAllEbayListings = function(authToken, callback){
  ebay.ebayApiPostXmlRequest({
    serviceName : 'Trading',
    opType : 'GetSellerList',
    
    devName: '8fa0915f-a719-429f-9b67-1a0825b294b8',
    cert: 'a21903b2-fd17-4453-835e-4c44ea3dc2c7',
    appName: 'DonaldBa-57d8-4a4e-9a01-7aca78e78907',
    
    sandbox: true,
    
    params: {
      'authToken':'AgAAAA**AQAAAA**aAAAAA**TYGgVA**nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6wFk4GhDZCLqQqdj6x9nY+seQ**cysDAA**AAMAAA**Ssea6bYMpvF7m7Txw6Enm4aBQa2P7lnTfNu9v3nJXnkrCOnbDiGZITFhN7aMO+h5Eu/5aMgKa3q5Wv0GXd82ODt/h9VNAkqGSczDko0IxYrBQS7H63w4+uWS1pjxmHDjQgmNFemcmvmcCNkqEvA0/Hfjc1V11QG+DhJcFh02H6lm8izWe993WUoTOkU0rSDm/lVSupe6Neb5A07li8QOw+XlJM33UXPROui40xLuV6X3CkxYWoTIbWYY33sj2BUoXosaLN53Xoux9XRuiKG2sJrwTmpPzjsH414a6cBsNsO0xxMX/wVk5SZ9uIJq7z6uvx5m+kZmtzWshuERk+VwuOrjaequ4jXiIkdUjbZBHJGP50GvP6gesedkEFjEYL3lCc7FpoT3cpoR+RXoXu6JB5Iar8JZ8D1VhnochlSAp0ZK199W7uTgVyYwUtXs38OwIZ041kxjQ6TIMwSygkImaFapsjbbTCc1UFJ0YpB4ZH1KyemFSfR8F9MB376ojIJDyk/35rUUDgQ0cWvkORStU8Lb66+bZtB7PwfSL7UfdehHMFPYami7tZdyizxB/NozyMfaLd7cak0lupMUq0ooR+O8aig1fKcBfCBqQorrcT0RIx8HXxT875/4fC+l7Dzv4vFXuuN8GsupZpzPt9gTchBX2nLbw4Xze1J+irpW6QjwhgVvDaE8UODVnAROxfwLQ4FtIH44f1SCeBE5F/iMIF2chJt8U7T5dAN65A0anDfvnDnDibUsVZTsLmDT2HDE',
      'EndTimeFrom': '2014-11-04T15:46:00.000Z',
      'EndTimeTo': '2015-01-04T15:46:00.000Z'
      // 'OrderStatus': 'Active',
      // 'NumberOfDays': 1
    }
    
  }, function(error, results) {
    if (error) {
      console.dir(error);
      process.exit(1);
    }
    console.dir(results.ItemArray);
  });
};

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

var updateEbayItemCount = function(whoknows, callback){
//WORKING REVISE ITEM REQUEST
var Item = new Object({
  ItemID: '110154759051',
  StartPrice:'5.00',
  Quantity:'2'
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
    
  }, 

  function(error, results) {
    if (error) {
      console.dir(error);
      process.exit(1);
    }
    console.dir(results);
  });
};
module.exports = {
  getEbayItemCount: getEbayItemCount,
  getEbayItem: getEbayItem,
  getAllEbayListings: getAllEbayListings,
  getUsersEbayInfo: getUsersEbayInfo,
  updateEbayItemCount: updateEbayItemCount
};