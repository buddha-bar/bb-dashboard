angular.module('dashboard').factory('Item', function($resource){
  return $resource('/api/items')
});