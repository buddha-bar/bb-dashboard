var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoClient = require('mongodb').MongoClient;

// var users = require('./routes/users');
var fs = require('fs');
var app = express();


//set mongo db connection
var db = mongoose.connection;

mongoose.connect('mongodb://localhost:27017/test', function(err, db) {
  if(!err) {
    console.log("We are connected");
  };
}); 

//regan test
require('./models/user');
// require('./models/item');
// require('./models/store');
// require('./models/storeitem');

var http    = require( 'http' );
var path    = require( 'path' );
var User    = mongoose.model( 'User' );

// Bootstrap models
var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path+'/'+file)
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'something',
    resave: true,
    saveUninitialized: true
}));

// Attach Routes: 'index.js'
require('./routes/index')(app);


app.get('/', function(req, res) {
  res.render('index', { title: 'Buddha Bar' })
});
// app.use('/users', routes.index);
// app.get('/', routes.index);

// exports.index = function ( req, res ){
//   User.find( function ( err, users, count ){
//     res.render( 'index', {
//       title : 'Buddha Bar',
//       users : users
//     });
//   });
// };


// app.use('/users', users);
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// Make our db accessible to our router
app.use(function(req, res, next){
  req.db = db;
  next();
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;


