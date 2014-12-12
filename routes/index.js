var express = require('express');
var router = express.Router();
var OAuth = require('oauth');
// var request = require('request');
// var OAuth   = require('oauth-1.0a');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Buddha Bar: Online Store Manager' });
});


router.get('/test', function(req, res){
     // var OAuth = require('oauth');
    var domain = 'http://localhost:3000';

    var oauth = new OAuth.OAuth(
      'https://openapi.etsy.com/v2/oauth/request_token',
      'https://openapi.etsy.com/v2/oauth/access_token',
      'glv40yg7ycl6czknj4f9v0xw',
      'w1udrm2cuk',
      '1.0',
      domain + '/auth/etsy/callback',
      'HMAC-SHA1'
    );
    
    oauth.getOAuthRequestToken(function(err, token, token_secret, result) {
        console.log(arguments);
    });

    // oauth.get(
    //   'https://openapi.etsy.com/v2/listings/:listing_id',
    //   'your user token for this app', //test user token
    //   'your user secret for this app', //test user secret            
    //   function (e, data, res){
    //     if (e) console.error(e);        
    //     console.log(require('util').inspect(data));    
    //   });    

});
// var oauth = new OAuth({
//     consumer: {
//         public: 'glv40yg7ycl6czknj4f9v0xw',
//         secret: 'w1udrm2cuk'
//     }
// });


// Obtaining Temporary Credentials - request token
// var request_data = {
//     url: 'https://openapi.etsy.com/v2/oauth/request_token?scope=email_r',
//     method: 'POST'
// };

// request({
//     url:    request_data.url,
//     method: request_data.method,
//     form:   oauth.authorize(request_data),
//     json:   true //parse respone as json
// }, function(err, res, data) {
//     // {
//     //     login_url: 'https://www.etsy.com/oauth/signin?oauth_consumer_key=xxx&oauth_token=xxx&service=v2_prod',
//     //     oauth_token: 'xxx',
//     //     service: 'xxx',
//     //     oauth_token_secret: 'xxx',
//     //     oauth_callback_confirmed: 'true',
//     //     oauth_consumer_key: 'xxx',
//     //     oauth_callback: 'oob'
//     // }
// }
// access the login_url to get the credential (oauth_verifier)

// var request_data = {
//     url:    'https://openapi.etsy.com/v2/oauth/access_token',
//     method: 'POST',
//     data: {
//         oauth_verifier: 'xxx'
//     }
// };

// var token = {
//     public: 'xxx',
//     secret: 'xxx'
// }

// request({
//     url:    request_data.url,
//     method: request_data.method,
//     form:   oauth.authorize(request_data, token)
// }, function(err, res, data) {
//     // oauth_token=xxx&oauth_token_secret=xxx
// });
// access the login_url to get the credential

// Obtaining Token Credentials - access token

// var request_data = {
//     url: 'https://openapi.etsy.com/v2/oauth/access_token',
//     method: 'POST',
//     data: {
//         oauth_verifier: 'xxx'
//     }
// };

// var token = {
//     public: 'xxx',
//     secret: 'xxx'
// }

// request({
//     url: request_data.url,
//     method: request_data.method,
//     form: oauth.authorize(request_data, token)
// }, function(err, res, data) {
//     // oauth_token=xxx&oauth_token_secret=xxx
// });
// Making an Authorized Request to the API - since you got the tokens you can use oauth-request to play around with the API

// var request_data = {
//     url: 'https://openapi.etsy.com/v2/users/__SELF__',
//     method: 'GET'
// };

// var token = {
//     public: 'xxx',
//     secret: 'xxx'
// }

// request({
//     url: request_data.url,
//     qs: oauth.authorize(request_data, token),
//     json: true
// }, function(err, res, data) {
//     // {
//     //     count: 1,
//     //     results: [{
//     //         user_id: 53899516,
//     //         login_name: 'ddooo',
//     //         primary_email: 'joeddo89@gmail.com',
//     //         creation_tsz: 1411796074,
//     //         referred_by_user_id: null,
//     //         feedback_info: [Object],
//     //         awaiting_feedback_count: 0
//     //     }],
//     //     params: {
//     //         user_id: '__SELF__'
//     //     },
//     //     type: 'User',
//     //     pagination: {}
//     // }
// });

module.exports = router;
