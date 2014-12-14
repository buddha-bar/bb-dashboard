(function(){
  var app = angular.module('dashboard', []);
  
  app.controller('ItemController', function(){
    this.item = items;
  });

  //need to loop through items in DB for now using these test objects
  var items = [
    {
      name : 'name',//query to db for name goes here
      stock : '4',//query to db
      img : '/images/bb-logo.png'//query to db
    }
    {
      name : 'name2',//query to db for name goes here
      stock : '6',//query to db
      img : '/images/bb-logo.png'//query to db
    }
  ];

})();


db.test.find(); // { age: { $gt: 18 } }, { name: 1, stock: 1 } )
