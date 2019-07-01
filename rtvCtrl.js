angular.module('myApp')
.controller("rtvCtrl", function ($scope, $http, $window) {
    $scope.questions = ["the name of your first pet", "your favorite movie"];
    $scope.submit = function(){
        $http.post('http://localhost:3000/retrievePass',
        {
            "userName": $scope.uname,
            "question": $scope.question,
            "answer": $scope.answer
        }).then(function(response){ 
            $window.alert("your password: " + response.data[0].Password);
            location.href='#!login';
        }, function errorCallback(response) {
        });
    };
});