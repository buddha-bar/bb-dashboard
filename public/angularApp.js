(function(){
  var app = angular.module('dashboard', ['ngResource', 'ui.router', 'ngRoute']);

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
      // .state('login.etsy', {
      //   url: "/etsy",
        // templateUrl: "partials/state1.list.html",
        // controller: function($scope) {
        //   $scope.items = ["A", "List", "Of", "Items"];
        // }
      // })
      .state('dashboard', {
        url: "/dashboard",
        templateUrl: "views/dashboard.ejs"
      })
      .state('post-item', {
        url: "/post-item",
        templateUrl: "/views/post-item.ejs"
      })

  });
  
  app.controller('ItemController', function($scope, $http, Item){
    $scope.inventory = Item.query();
    $scope.amazonItems = Item.query();
    $scope.etsyItems = Item.query();
    $scope.ebayItems = Item.query();

    $scope.updateItems = function(items) {
      $scope.inventory = Item.query();
      $scope.amazonItems = Item.query();
      $scope.etsyItems = Item.query();
      $scope.ebayItems = Item.query();
    }

    $scope.updateItemCount = function(item, newCount) {
      for(var i = 0; i < $scope.inventory.length; i++){

        item.stock = newCount;

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
        }).
          error(function(data, status, headers, config) {
        }); 
    }

  });

// ======== LOGIN =================


  app.service('UserSvc', function($http){
    var svc = this;
    svc.getUser = function() {
      return $http.get('/api/users',{
        headers: { 'X-Auth': this.token }
      })
    }
    svc.login = function(username, password){
      return $http.post('/api/sessions', {
        username: username, password: password
      }).then(function(val){
        svc.token = val.data
        // window.localStorage.token = val.data
        return svc.getUser()
      })
    }
    // svc.logout = function() {
    //   return $http.post('/api/sessions', {
    //     username: username, password: password
    //   }).then(function(val){
    //     svc.token = null
    //   })
    // }
    svc.logout = function() {
      $http.post('/api/sessions', {
        username: null, password: null
      }).then(function(val){
        svc.token = null
      })
    }
    // svc.logout = function(val) {
    //   svc.token = null
    // }
  })

  app.controller('LoginCtrl', function($scope, UserSvc){
    $scope.login = function(username, password) {
      UserSvc.login(username, password)
      .then(function(response) {
        $scope.$emit('login', response.data)
      })
    }
    $scope.logout = function() {
      UserSvc.logout();
      $scope.$emit('logout')
    }
    // $scope.logout = function() {
    //   UserSvc.logout()
    //   .then(function(response){
    //     $scope.$emit('logout', response.data)
    //   })
    // }
  });


  // app.controller('LoginController', function($scope, $location, $http){

   
  //   $scope.login = function(credentials) {

  //     $http.post('/api/login', {user: credentials.username, password: credentials.password }).   
  //         success(function(data, status, headers, config) {
  //           console.log('working');
  //           $location.path('/dashboard');
  //         }).
  //           error(function(data, status, headers, config) {
  //             console.log('did not work');
  //         }); 
  //   }

  //   $scope.logout = function(credentials) {

  //     $http.post('/api/logout', {user: credentials.username }).   
  //         success(function(data, status, headers, config) {
  //         }).
  //           error(function(data, status, headers, config) {
  //         }); 
  //   }

  // });

  app.controller('ApplicationCtrl', function($scope) {
      $scope.modalShown = true;
      // $scope.toggleModal = function() {
      //   console.log('clicked');
      //   $scope.modalShown = !$scope.modalShown;
      // };

      // $scope.currentUser = null;
     
      $scope.$on('login', function (_, user){
        $scope.currentUser = user;
      })

      // $scope.$on('logout', function (_, user){
      //   $scope.currentUser = null;
      // })

      $scope.$on('logout', function (){
        $scope.currentUser = null;
      })
  });

// ============ LOGIN END ===================


//============ MODAL==================
// http://adamalbrecht.com/2013/12/12/creating-a-simple-modal-dialog-directive-in-angular-js/
app.directive('modalDialog', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
      scope.hideModal = function() {
        scope.show = false;
      };
    },
    template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hideModal()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='hideModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div><button class='hidden' ng-click='hideModal()'>Finished</button></div></div>"
  };
});


  app.controller('AuthoCtrl', function($scope, $window, $routeParams, $location) {
    $scope.name = 'authorize';
    $scope.goEtsy = function() {
      $window.location.href = 'http://localhost:3000/etsy';
    }
    $scope.goAmazon = function() {
      $window.location.href = 'http://localhost:3000/amazon';
    }
    $scope.goEbay = function() {
      $window.location.href = 'http://localhost:3000/ebay';
    }
  });


//===== MODAL END =========

  app.controller('PostController', function(){
    // this.post = 1;

    this.setPost = function(newValue){
      this.post = newValue;
    };

    this.isSet = function(postName){
      return this.post === postName;
    };
  });

  //DELETE!!!
  app.controller('indexController', function(){
  });


  app.directive('topbar', function() {
    return {
      templateUrl: '/views/topbar.ejs'
    };
  }); 


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