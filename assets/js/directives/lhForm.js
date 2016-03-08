angular.module('LinkedHub').directive('lhForm', function() {
    return {
        replace: true,
        restrict: 'E',
        templateUrl: '/templates/lhForm.html'
    }
});
