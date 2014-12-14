var mongoose = require('mongoose');

var Items = mongoose.Schema({
    name: String,
    stock: Number
});

var User = mongoose.Schema({
    username: String,
    password: String,
    item: [Items],
    credentials: {
      amazon: Object,
      etsy: Object,
      ebay: Object
    }
});

module.exports = mongoose.model('User', User);
