angular.module('LinkedHub').factory('Request', function($resource) {
    return $resource('http://localhost:1337/parse');
});
