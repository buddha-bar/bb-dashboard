var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Store = mongoose.Schema({
    name: String
});

module.exports = mongoose.model('Store', Store);
