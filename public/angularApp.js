(function(){
  var app = angular.module('dashboard', ['ngResource', 'ui.router']);
  
  app.controller('ItemController', function($scope, $http, Item){
    $scope.items = Item.query();
    $scope.updateItemCount = function(item, newCount) {
      // change item, update stock and pass id
      $http.post('/api/etsy/items/'+ item._id, { stock: newCount }).   
        success(function(data, status, headers, config) {

          //find items with same id scope and update
          //transclusion
          
          for(var i = 0; i < $scope.items.length; i++){
            var matchItem = $scope.items[i];
            if(matchItem._id == item._id){
              matchItem.stock = newCount;
            }
          };

        }).
        error(function(data, status, headers, config) {
        }); 
    }

    // $scope.updateItems = function($scope) {
    //   $scope.items = Item.query();
    // }

  });

  // app.controller('utilityController', function($scope)){
    
  // }

  app.config(function($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/");
    //
    // Now set up the states
    $stateProvider
      .state('dashboard', {
        url: "/",
        templateUrl: "views/dashboard.ejs"
      })
      // .state('state1.list', {
      //   url: "/list",
      //   templateUrl: "partials/state1.list.html",
      //   controller: function($scope) {
      //     $scope.items = ["A", "List", "Of", "Items"];
      //   }
      // })
      .state('post-item', {
        url: "/post-item",
        templateUrl: "/views/post-item.ejs"
      })
      // .state('state2.list', {
      //   url: "/list",
      //   templateUrl: "partials/state2.list.html",
      //   controller: function($scope) {
      //     $scope.things = ["A", "Set", "Of", "Things"];
      //   }
      // });
  });

  app.controller('PostController', function(){
    // this.post = 1;

    this.setPost = function(newValue){
      this.post = newValue;
    };

    this.isSet = function(postName){
      return this.post === postName;
    };
  });

  app.directive('topbar', function() {
    return {
      templateUrl: '/views/topbar.ejs'
    };
  }); 

  // app.directive('dashboard', function() {
  //   return {
  //     templateUrl: '/views/dashboard.ejs'
  //   };
  // });

  // app.directive('postItem', function() {
  //   return {
  //     templateUrl: '/views/post-item.ejs'
  //   };
  // }); 

  app.directive('selectMenu', function() {
    return {
      templateUrl: '/views/select-menu.ejs'
    };
  });

  app.directive('etsyForm', function() {
    return {
      templateUrl: '/views/etsy-form.ejs'
    };
  });

  app.directive('etsyContainer', function() {
    return {
      templateUrl: '/views/etsy-container.ejs'
    };
  });

  app.directive('amazonContainer', function() {
    return {
      templateUrl: '/views/amazon-container.ejs'
    };
  });

  app.directive('ebayContainer', function() {
    return {
      templateUrl: '/views/ebay-container.ejs'
    };
  });

  app.directive('item', function() {
    return {
      templateUrl: '/views/item.ejs'
    };
  });

})();


// modules
// includeing dependiencys
// other methods of resoucres