var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = mongoose.Schema({
    username: String,
    password: String,
    items: [{ type : Schema.ObjectId, ref : 'Item' }],
    credentials: {
      amazon: Object,
      etsy: Object,
      ebay: Object
    }
});

module.exports = mongoose.model('User', User);