angular.module('LinkedHub').controller('HomeController', function(Request, Result, $scope, $location) {

    $scope.submitingForm = false;

    $scope.getResults = function(data) {
        $scope.submitingForm = true;

        var payload = {
            linkedin: data.linkedin,
            github: data.github
        };

        //Send information to the API
        Request.save(payload,
          function(response){
            Result.addResult(response);
            // redirect to the dashboard view
            $location.path("/dashboard");
          },
          function(err){
            $scope.submitingForm = false;
            alert((err || {}).data || 'Error parsing the profiles');
          }
        );

    }
});
