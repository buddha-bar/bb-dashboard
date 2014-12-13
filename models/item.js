var mongoose = require('mongoose');

var Item = mongoose.Schema({
    name: String,
    stock: Number
  }
});

module.exports = mongoose.model('Item', Item)


  