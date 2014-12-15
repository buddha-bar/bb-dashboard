var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var Items = mongoose.Schema({
//     name: String,
//     stock: Number
// });

var User = mongoose.Schema({
    username: String,
    password: String,
    // item: [Items],
    items: [{ type : Schema.ObjectId, ref : 'Item' }],
    credentials: {
      amazon: Object,
      etsy: Object,
      ebay: Object
    }
});

module.exports = mongoose.model('User', User);
