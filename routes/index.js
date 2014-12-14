express = require('express');
session = require('express-session');
cookieParser = require('cookie-parser');
url = require('url');
etsyjs = require('etsy-js');

var client = etsyjs.client({
  key: 'glv40yg7ycl6czknj4f9v0xw',
  secret: 'w1udrm2cuk',
  callbackURL: 'http://localhost:8080/authorise'
});

app = express();
app.use(cookieParser('secEtsy'));
app.use(session());

app.get('/', function(req, res) {
  client.requestToken(function(err, response) {
    if (err) {
      return console.log(err);
    }

    req.session.token = response.token;
    req.session.sec = response.tokenSecret;
    res.redirect(response.loginUrl);
  });
});

app.get('/authorise', function(req, res) {
  // parse the query string for OAuth verifier
  query = url.parse(req.url, true).query;
  verifier = query.oauth_verifier;

  // final part of OAuth dance, request access token and secret with given verifier
  client.accessToken(req.session.token, req.session.sec, verifier, function(err, response) {
    // update our session with OAuth token and secret
    console.log('Error', err);
    console.log('Response', response);
    req.session.token = response.token;
    req.session.sec = response.tokenSecret;
    res.redirect('/find');
    var userCredentials = {
        user.token = response.token;
        user.secret = response.secret;
    };
  });
});

app.get('/find', function(req, res) {
  // we now have OAuth credentials for this session and can perform authenticated requests
  console.log('sec', req.session.sec);
  client.auth(req.session.token, req.session.sec).user("donaldballard1").addresses(function(err, body, headers) {
    if (err) {
      console.log(err);
    }


    if (body) {
      console.dir(body);
      res.send(body.results[0]);
    } else {
      res.status(403);
      res.send("Not Authorized");
    }
  });
});

server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});
















































// var express = require('express');
// var router = express.Router();
// var OAuth = require('oauth').OAuth;
// // var request = require('request');
// // var OAuth   = require('oauth-1.0a');

// /* GET home page. */
// router.get('/', function(req, res) {
//   res.render('index', { title: 'Buddha Bar: Online Store Manager' });
// });

// function getAuthToken(req, res, oauth) {
//     oauth.getOAuthRequestToken(function(err, token, token_secret, result) {
//          if (err) return console.log( err );

//         req.session.oauth = {};
//         req.session.oauth.token = token;
//         req.session.oauth.token_secret = token_secret;
        
//         // redirect the etsy url
//         res.redirect( result[ "login_url" ] );
//     });
// }

//  var domain = 'http://localhost:3000';
//  var oauth = new OAuth(
//       'https://openapi.etsy.com/v2/oauth/request_token',
//       'https://openapi.etsy.com/v2/oauth/access_token',
//       'glv40yg7ycl6czknj4f9v0xw',
//       'w1udrm2cuk',
//       '1.0',
//       domain + '/auth/etsy/callback',
//       'HMAC-SHA1'
// );
//  // function to test data, 

// function testGettingUserProfile(token, token_secret, callback) {
//     oauth.get('/users/dj', function(err, data) {
//         callback(data);
//     });
// }

// router.get('/auth/etsy/callback', function(req, res) {
//     var verifier = req.query.oauth_verifier;
//     var token = req.session.oauth.token;
//     var secret = req.session.oauth.token_secret;
//     // console.log(verifier);
//     // console.log(token);
//     // console.log(secret);
//     oauth.getOAuthAccessToken(token, secret, verifier, function(err, token, token_secret, results){
//         if (err) { return res.status(500).end(); }
//         console.log(results);
     
//     });
// });



// router.get('/auth/etsy', function(req, res){

//     getAuthToken(req, res, oauth);

// });
// module.exports = router;
