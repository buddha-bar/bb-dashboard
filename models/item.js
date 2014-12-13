var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = mongoose.Schema({
    id: ,
    name: String,
    user_id: ,
    stock: Number
  }
});

module.exports = mongoose.model('Item', userSchema)


  