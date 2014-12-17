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

  .directive('topbar', function() {
    return {
      templateUrl: '/veiws/topbar.ejs'
    };
  });

  .directive('dashboard', function() {
    return {
      templateUrl: '/veiws/dashboard.ejs'
    };
  });

  .directive('selectMenu', function() {
    return {
      templateUrl: '/veiws/selectMenu.ejs'
    };
  });

  .directive('etsyContainer', function() {
    return {
      templateUrl: '/veiws/etsy-container.ejs'
    };
  });

  .directive('amazonContainer', function() {
    return {
      templateUrl: '/veiws/amazon-container.ejs'
    };
  });

  .directive('ebayContainer', function() {
    return {
      templateUrl: '/veiws/ebay-container.ejs'
    };
  });

})();


// modules
// includeing dependiencys
// other methods of resoucres