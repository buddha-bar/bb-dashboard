var mongoose = require('mongoose');

var Item = mongoose.Schema({
    name: String,
    stock: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Item', Item)


  