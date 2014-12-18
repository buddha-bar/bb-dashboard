var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Item = mongoose.Schema({
    name: String,
    stock: Number,
    image: String,
    owner: {type: Number, ref: 'User'},
    etsy: {
      listingId: String,
      stock: Number,
      store: String
    },
    amazon: {
      listingId: String,
      stock: Number,
      store: String
    }
});

module.exports = mongoose.model('Item', Item)

