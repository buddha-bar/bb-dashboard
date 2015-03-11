// var request = require('request')

// application url: http://276e81be.ngrok.com
// callback: '/etsy-pubHub'

// Send a POST request to https://etsy.superfeedr.com, with the following parameters:
// hub.mode: subscribe or unsubscribe
// hub.callback: http://domain.tld/your/callback
// hub.topic: http//feed.you.want.to/subscribe/to

// hub.mode: subscribe
// hub.callback: http://276e81be.ngrok.com/etsy-pubHub
// hub.topic:  http://www.etsy.com/api/push/shops/buddhabarapp/listings/latest.atom
// lol = function() {
// console.log("before request");
//   request.post({
//     url: 'https://etsy.superfeedr.com', 
//     form:
//       {'hub.mode':'subscribe'},
//       {'hub.callback':'http://276e81be.ngrok.com/etsy-pubHub'},
//       {'hub.topic':'http://www.etsy.com/api/push/shops/buddhabarapp/listings/latest.atom'}
//   }, function(error, response, body){
//     console.log(body);
//     response
//   });
// };
// lol();

// request.get({
//     url: 'https://etsy.superfeedr.com',
//     parameters: {
//         ca: fs.readFileSync('ca.cert.pem')
//     }
// });