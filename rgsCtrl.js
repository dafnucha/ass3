
angular.module('myApp')
.controller("rgsCtrl", function ($scope, $http, $window) {
    $scope.categories = [];
    $http.get('http://localhost:3000/getCategories').then(function(response){
        var i;
        for(i = 0; i<response.data.length; i++){
            $scope.categories.push(response.data[i].Name);
        }
        
    });
    $scope.countries = ["Australia", "Bolivia", "China", "Denemark", "Israel", "Latvia", "Monaco", "August", "Norway", "Panama", "Switzerland", "USA"];
    $scope.submit = function(){
        if($scope.cat.length >= 2){
            $http.post('http://localhost:3000/register',
            {"firstName": $scope.fname,
            "lastName": $scope.lname,
            "city": $scope.city,
            "country": $scope.country,
            "email": $scope.email,
            "categories": $scope.cat,
            "questions": ["the name of your first pet", "your favorite movie"],
            "answers": [$scope.A1, $scope.A2]
            }).then(function(response){ 
                $window.alert("your username: " + response.data[0] + ", and password: " + response.data[1]);
                location.href='#!';
            }, function errorCallback(response) {
            });
        }
        else{
            $window.alert("please choose 2 or more categories");
        }
    }
});



