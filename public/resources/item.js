angular.module('dashboard').factory('Item', function($resource){
  // console.log('Item resource initialized');
  return $resource('/api/items');

  //{ 'query':  {method:'GET', isArray:true} }
});