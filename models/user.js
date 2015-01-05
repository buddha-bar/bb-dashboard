var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true, select: false},
    items: [{ type: Schema.Types.ObjectId, ref: 'Item'}],
    credentials: {
      amazon: Object,
      etsy: Object,
      ebay: Object
    }
});

module.exports = mongoose.model('User', User);
