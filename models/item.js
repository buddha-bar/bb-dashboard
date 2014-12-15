var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Item = mongoose.Schema({
    name: String,
    stock: Number
});

module.exports = mongoose.model('Item', Item)


  