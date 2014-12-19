(function(){
  var app = angular.module('dashboard', ['ngResource', 'ui.router']);
  
  app.controller('ItemController', function($scope, $http, Item){
    $scope.inventory = Item.query();
    $scope.amazonItems = Item.query();
    $scope.etsyItems = Item.query();
    $scope.ebayItems = Item.query();
    $scope.updateItemCount = function(item, newCount) {

      // item.stock = newCount;
      
      for(var i = 0; i < $scope.inventory.length; i++){

        if($scope.ebayItems[i]._id == item._id){
          $scope.ebayItems[i].stock = newCount;
        }
        if($scope.amazonItems[i]._id == item._id){
          $scope.amazonItems[i].stock = newCount;
        }
        if($scope.etsyItems[i]._id == item._id){
          $scope.etsyItems[i].stock = newCount;
        }
      };

      // change item, update stock and pass id
      $http.post('/api/etsy/items/'+ item._id, { stock: newCount }).   
        success(function(data, status, headers, config) {
          //find items with same id scope and update
          //transclusion
        }).
          error(function(data, status, headers, config) {
        }); 

      /*
      // change item, update stock and pass id
      $http.post('/api/amazon/items/'+ item._id, { stock: newCount }).   
        success(function(data, status, headers, config) {
          //find items with same id scope and update
          //transclusion
        }).
          error(function(data, status, headers, config) {
        }); 

      // change item, update stock and pass id
      $http.post('/api/ebay/items/'+ item._id, { stock: newCount }).   
        success(function(data, status, headers, config) {
          //find items with same id scope and update
          //transclusion
        }).
          error(function(data, status, headers, config) {
        }); 
      */
    }

    $scope.updateItems = function(items) {
      console.log('items:', items);
      $scope.items = Item.query();
      console.log('scope items: ', $scope.items);
    }

  });

  // app.controller('utilityController', function($scope)){
    
  // }

  app.config(function($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/404");
    //
    // Now set up the states
    $stateProvider
      .state('login', {
        url: "",
        templateUrl: "views/login.ejs"
      })
      .state('dashboard', {
        url: "/dashboard",
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

  app.controller('indexController', function(){

  })

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

  app.directive('inventoryContainer', function() {
    return {
      templateUrl: '/views/inventory-container.ejs'
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

  app.directive('autho-modal', function() {
    return {
      templateUrl: '/views/autho-modal.ejs'
    };
  });

})();


// modules
// includeing dependiencys
// other methods of resoucres