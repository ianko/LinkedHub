angular.module('LinkedHub').config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/templates/homeView.html',
      controller: 'HomeController'
    })
    .when('/dashboard', {
      templateUrl: '/templates/dashboardView.html',
      controller: 'DashboardController'
    });
});
