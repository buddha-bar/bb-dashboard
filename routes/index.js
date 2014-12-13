var express = require('express');
var router = express.Router();
var OAuth = require('oauth').OAuth;
// var request = require('request');
// var OAuth   = require('oauth-1.0a');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Buddha Bar: Online Store Manager' });
});

function getAuthToken(req, res, oauth) {
    oauth.getOAuthRequestToken(function(err, token, token_secret, result) {
         if (err) return console.log( err );

        req.session.oauth = {};
        req.session.oauth.token = token;
        req.session.oauth.token_secret = token_secret;
        
        // redirect the etsy url
        res.redirect( result[ "login_url" ] );
    });
}

 var domain = 'http://localhost:3000';
 var oauth = new OAuth(
      'https://openapi.etsy.com/v2/oauth/request_token',
      'https://openapi.etsy.com/v2/oauth/access_token',
      'glv40yg7ycl6czknj4f9v0xw',
      'w1udrm2cuk',
      '1.0',
      domain + '/auth/etsy/callback',
      'HMAC-SHA1'
);
 // function to test data, 

// function testGettingUserProfile(token, token_secret, callback) {
//     oauth.get('/users/dj', function(err, data) {
//         callback(data);
//     });
// }
console.log(OAuth.prototype);
router.get('/auth/etsy/callback', function(req, res) {
    var verifier = req.query.oauth_verifier;
    var token = req.session.oauth.token;
    var secret = req.session.oauth.token_secret;
    console.log(verifier);
    console.log(token);
    console.log(secret);

    oauth.getOAuthAccessToken(token, secret, verifier, function(err, token, token_secret, results){
        if (err) { return res.status(500).end(); }
        console.log(token, token_secret);
        res.status(200);
        // testGettingUserProfile(token, token_secret, function(data) {
        //     res.send(data);
        // })


        // if (req.session.oauth) {
        //     req.session.oauth.verifier = req.query.oauth_verifier;
        //     var auth = req.session.ouath;
        //     oauth.getOAuthAccessToken(
        //         auth.token,
        //         auth.token_secret,
        //         auth.verifier,
        //         function(err, token, token_secret, results){
        //             if (err) {
        //                 console.log(err);
        //             }
        //             else {
        //                 req.session.oauth.access_token = token;
        //                 req.session.oauth.access_token_secret = token_secret;
        //                  if (callback) callback.call(this, req, res);
        //             }
        //         }
        //     );
        // }
        // console.log(this);
    });
});



router.get('/auth/etsy', function(req, res){

    getAuthToken(req, res, oauth);

});
module.exports = router;
