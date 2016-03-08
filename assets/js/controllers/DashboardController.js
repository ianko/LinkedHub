angular.module('LinkedHub').controller('DashboardController', function(Result, $scope, $rootScope, $location) {

    var linkedinObj  = Result.getResult().linkedin;
    var githubObj  = Result.getResult().github;
    var counts  = Result.getResult().counts;

    if (!counts) {
      return $location.path('/');
    }

    // Delay to create the animation
    setTimeout(function() {
        var element = document.getElementsByClassName('main-holder')[0];

        if (element) {
          element.className += " active";
        }
    }, 250);

    $scope.name = linkedinObj.name;
    $scope.headline = linkedinObj.headline;

    $scope.avatar = githubObj.avatar_url;

    $scope.skills = counts.skills;
    $scope.others = counts.others;

    $scope.followers = githubObj.followers;
    $scope.following = githubObj.following;
    $scope.repo = githubObj.public_repos;
    $scope.gist = githubObj.public_gists;
});

angular.module('LinkedHub').filter('isBiggerThanZero', function() {
    return function(p) {
        return p > 0;
    }
});
