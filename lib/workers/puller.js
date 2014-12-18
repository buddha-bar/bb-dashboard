var etsyjs = require('etsy-js');
var Constants = require('../constants');
var etsy = require('../buddhaetsy/etsy');


// setInterval(stockUpdater.main(item number), 60000)

// This method will poll etsy, amazon, and the database for item counts and compare them.
//possibly loop through all items, like for user.items.length do: 

//mongoose populations...creating a schema for association in a no sql database
// consider having a sales that has a user and list of item id's 

// The realistic code is to create two loops, one for each user, one for the users items. 
// when all items have been updates, make a batch process for each user..so upder() lives outside of main and is called
// passing the objects required to update each store and each field. 
var stockUpdater = {
  main: function (){ //gets passed an user.item.id 
    collection();
    pull();
    process();
    update();
  }, 
  collection: function (){ //gets passed user.item.id 
    //going to return the items information for etsy and for amazon and store that into separate variables
    //including: etsy store, listing id, inventory count,  authentication info
    // amazon store, listing id, inventory count,authentication info 
    // passes necessary info for api request to pull function

    //Something like
    // Item.findOne({ id: 'thing' }, function(err, thing) {
    //   if (err) return console.error(err);
    //   console.dir(thing);
    // });
    // pull(thing);
  },
  pull: function () { // receives etsy and amazon item listing and auth params (thing)
    // var etsyCount = undefined;
    // var amazonCount = undefined;
    // getEtsyItemCount(thing.etsy.id)
    // var getEtsyItemCount = function(listingId, callback){
    //   var listing = "214898873";
    
    //   etsy.getClient().get('/listings/'+listing, function(err, status, body, headers){
    //      var etsyCount = body.count;
    //     
    //   });
    // };
    // getAmazonItemCount(Thing.amazon.id)
    // var getAmazonItemCount = function(){};
    //  process(etsyCount, amazonCount, thing);
    // saves etsy info and amazon inventory info into variables. 
    // passes counts (at least) to process function. 
  }, 
  process: function () { // receive etsy.count and amazon.count and db.count
    //set db count relative to -= ((db - etsy) + (db - amazon))
    //set db.item.etsy.count and db.item.amazon.count
    //pass new count to push
    // if db.count > dbcount || db.count < dbcount
    //find one and update db.count to dbcount
    //push dbcount
  }, 
  update: function () { //receives new count/object info. , also has to have the item information from pull?
    //updates new count on etsy amazon and dashboard. 
    //
  }
}

