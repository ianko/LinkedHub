angular.module('LinkedHub').service('Result', function() {
  var result = {};

  var addResult = function(newObj) {
      result = newObj;
  };

  var getResult = function() {
      return result;
  };

  return {
    addResult: addResult,
    getResult: getResult
  };

});