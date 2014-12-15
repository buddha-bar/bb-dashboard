var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StoreItem = mongoose.Schema({
    item_id: { type : Schema.ObjectId, ref : 'Item' },
    store_id: { type : Schema.ObjectId, ref : 'Store' },
    stock: Number,
    last_updated: Date,
    crawl_status: String
});

module.exports = mongoose.model('StoreItem', StoreItem);

  
  
