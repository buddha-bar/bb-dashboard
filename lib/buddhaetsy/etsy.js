var etsyjs = require('etsy-js');
var Constants = require('../constants');

console.log(Constants.callbacks.authorize);

var etsy = module.exports = {
    token: 'd7901d140b48afbac82b6f8928b34d',
    secret: '109b42c151', 
    username: "donaldballard1",
    shop: "buddhabarapp",
    getClient: function (){
        return etsyjs.client({
            key: 'glv40yg7ycl6czknj4f9v0xw',
            secret: 'w1udrm2cuk',
            callbackURL: Constants.callbacks.authorize
        });
    },
    auth: function (token, secret) {
        client = etsy.getClient();
        return client.auth(etsy.token, etsy.secret);
    }
}