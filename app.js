

let app = angular.module('myApp', ["ngRoute"]);

app.config(function($routeProvider)  {
    $routeProvider
        .when('/', {
            templateUrl: '3POI.html',
            controller : '3POICtrl'
        })
        .when('/about', {
            templateUrl: 'about.html'
        })
        .when('/register', {
            templateUrl: 'register.html',
            controller : 'rgsCtrl'
        })
        .when('/login', {
            templateUrl: 'login.html',
            controller : 'lgnCtrl'
        })
        .when('/logged', {
            templateUrl: 'logged.html',
            controller : 'lgdCtrl'
        })
        .when('/retrieve', {
            templateUrl: 'retrieve.html',
            controller : 'rtvCtrl'
        })
        .when('/POIs', {
            templateUrl: 'POI.html',
            controller : 'POICtrl'
        })
        .when('/fav', {
            templateUrl: 'favPOI.html',
            controller : 'fvPOICtrl'
        })
        .otherwise({ redirectTo: "/" });
});

angular.module('myApp')
.controller("mainCtrl", function ($scope, $rootScope, $http) {
    $scope.user = "guest";
    $scope.homeLink = "#!";
    $scope.isloginLink = "#!login";
    $scope.isloginText = " Please log in";
    $scope.fav = [];
    $scope.islogged = function(){
        if($scope.user == "guest"){
            $scope.isloginLink = "#!login";
        }else{
            $scope.isloginLink = "#!";
            $scope.homeLink = "#!";
            $scope.user = "guest";
            $scope.isloginText = " Please log in";
        }
    }
    $scope.$on('m', function(event, message){
        $scope.user=message.user;
        getFav();
        $scope.isloginText = " Logout";
        $scope.homeLink = "#!logged";
        $rootScope.$broadcast('ma', {
            user: $scope.user
        })
        $rootScope.$broadcast('mb', {
            user: $scope.user,
            new: true
        })
    })

    function getFav(){
        $http.get('http://localhost:3000/getFavorite/' +  $scope.user).then(function(response){
            $scope.fav = response.data;
        });
    }

    $scope.$on('requestFav', function(event, message){
        var x = $scope.fav;
        $rootScope.$broadcast('sendFav', {
            fav: x
        })
    })

    $scope.$on('removeFromFav', function(event, message){
        var x = [];
        for(var i = 0; i < $scope.fav.length; i++){
            if($scope.fav[i].ID != message.id){
                x.push($scope.fav[i]);
            }
        }
        $scope.fav = x;
        $rootScope.$broadcast('sendFav', {
            fav: x
        })
    })
});
/*
angular.module('myApp')
.controller("mainCtrl", function ($scope, $rootScope) {
    $scope.user = "guest"
    $scope.islogged=function(){
        if(document.getElementById("user").innerHTML=="guest"){
            document.getElementById("islogin").href="#!login";
        }else{
            document.getElementById("islogin").href="#!";
            document.getElementById("user").innerHTML = "guest";
            document.getElementById("islogin").innerHTML = " Please log in";
        }
    }
    $scope.$on('m', function(event, message){
        $scope.l=message.user;
    })
});
*/
