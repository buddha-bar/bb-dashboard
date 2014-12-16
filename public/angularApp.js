(function(){
  var app = angular.module('dashboard', ['ngResource']);
  
  app.controller('ItemController', function($scope, Item){

    $scope.items = Item.query();


    // for reference 
    // Ruby
    // @user = User.find(100)
    // @user.name = 'Chris'
    // @user.save

    // JS
    // var user = User.find(1);
    // user.name = 'Chris';
    // user.save();

  });

    //need to loop through items in DB for now using these test objects
    // var items = [
    //   {
    //     name : 'name1',//query to db for name goes here
    //     stock : '4',//query to db
    //     img : '/images/bb-logo.png'//query to db
    //   },
    //   {
    //     name : 'name2',//query to db for name goes here
    //     stock : '6',//query to db
    //     img : '/images/bb-logo.png'//query to db
    //   },
    //   {
    //     name : 'name3',//query to db for name goes here
    //     stock : '6',//query to db
    //     img : '/images/bb-logo.png'//query to db
    //   }
    // ];

})();


// modules
// includeing dependiencys
// other methods of resoucres