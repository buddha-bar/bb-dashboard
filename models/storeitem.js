var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StoreItemSchema = mongoose.Schema({
    item_id: ObjectId,
    store_id: ObjectId,
    stock: Number,
    last_updated: Date,
    crawl_status: String
  }
});

module.exports = mongoose.model('StoreItem', userSchema);

  
  
