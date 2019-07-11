
angular.module('myApp')
.controller("lgnCtrl", function ($scope, $rootScope, $http, $window) {
    $scope.submit = function(){
        var userName=$scope.uname;
        var pass = $scope.pass;
        $http.post('http://localhost:3000/login',{"userName": userName, "password": pass}).then(function(response){
            if(response.data == "wrong password or username"){
                $window.alert("wrong password or username");
            }
            else{
                sessionStorage.setItem("user",userName );
                $rootScope.$broadcast('m', {
                    user: userName
                })
                location.href='#!logged';
            }
        }, function errorCallback(response) {
            $scope.invalid = "wrong username or password"
        });
        
    }
});

