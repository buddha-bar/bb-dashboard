var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    tokens: {
      amazon: String,
      etsy: String,
      ebay: String
    }
});

module.exports = mongoose.model('User', userSchema);
