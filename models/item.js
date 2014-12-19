var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Item = mongoose.Schema({
    name: String,
    stock: Number,
    image: String,
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    etsy: {
      listingId: String,
      stock: Number,
      etsystore: String,
      store: String
    },
    amazon: {
      listingId: String,
      stock: Number,
      amazonstore: String,
      store: String
    }
});

module.exports = mongoose.model('Item', Item)

// populate etsy column with where store = etsy 