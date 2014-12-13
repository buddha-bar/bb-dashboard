var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = mongoose.Schema({
    id: ,
    name: String,
    user_id: ,
    stock: Number
    }
});

module.exports = mongoose.model('Product', userSchema);
