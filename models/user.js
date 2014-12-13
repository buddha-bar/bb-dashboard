var mongoose = require('mongoose');

var User = mongoose.Schema({
    username: String,
    password: String,
    items: [Item]
    credentials: {
      amazon: Object,
      etsy: Object,
      ebay: Object
    }
});

module.exports = mongoose.model('User', User);
