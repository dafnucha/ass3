
angular.module('myApp')
.controller("lgnCtrl", function ($scope, $rootScope, $http) {
    $scope.submit = function(){
        var userName=$scope.uname;
        var pass = $scope.pass;
        $http.post('http://localhost:3000/login').then(function(response){
            /////////////////////////s
        });
        $rootScope.$broadcast('m', {
            user: userName
        })
    }
});

