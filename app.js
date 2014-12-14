var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoClient = require('mongodb').MongoClient;
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
//set mongo db connection
var db = mongoose.connection;

mongoose.connect('mongodb://localhost:27017/test', function(err, db) {
  if(!err) {
    console.log("We are connected");
  };
}); 

var Users = require('./models/user');
var Items = require('./models/item');
var Store = require('./models/store');
var StoreItem = require('./models/storeitem');

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

// app.use('/', routes);
app.get('/', function(req, res) {
  res.render('index', { title: 'Buddha Bar' })
});

app.use('/test', routes);
app.use('/users', users);
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
