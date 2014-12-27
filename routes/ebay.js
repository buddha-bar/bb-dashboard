var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var url = require('url');
var mongoose = require('mongoose');
var ebay = require('ebay-api');
module.exports = function(app) {
  app.get('/ebay',function(req, res){
     ebay.ebayApiPostXmlRequest(
       serviceName : 'Trading' 
       opType : 'GetOrders' 

       devName: '8fa0915f-a719-429f-9b67-1a0825b294b8'
       cert: 'a21903b2-fd17-4453-835e-4c44ea3dc2c7' 
       appName: 'DonaldBa-57d8-4a4e-9a01-7aca78e78907' 

       sandbox: true 

       params: 
  // (very long string 
         'OrderStatus': 'Active'
   
       }, function(error, results){
       if (error) {
         console.dir(error)
       }
       else {
       console.dir(results) 
      }
      };
     });
  });

}