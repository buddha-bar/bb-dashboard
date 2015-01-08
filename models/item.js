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
      image: String,
      store: String
    },
    ebay: {
      ItemID: String,
      quantity: Number,
      ebaystore: String,
      image: String,
      price: String,
      store: String
    }
});

module.exports = mongoose.model('Item', Item)

// populate etsy column with where store = etsy 