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
.controller("mainCtrl", function ($scope, $http) {

    function getFav(){
        $http.get('http://localhost:3000/getFavorite/' +  $scope.user).then(function(response){
            $scope.fav = response.data;
            sessionStorage.setItem("fav",JSON.stringify($scope.fav));
            sessionStorage.setItem("ref", "true");
            $scope.countFav = $scope.fav.length;
        });
    }

    $scope.$on('m', function(event, message){
        $scope.user=sessionStorage.getItem("user");
        getFav();
        $scope.isloginText = " Logout";
        $scope.homeLink = "#!logged";
        $scope.isloginLink = "#!";
        setTimeout(()=>{
            $scope.countFav = $scope.fav.length;
        },1000);
        $scope.logged2= false;
    })
    
    $scope.user=sessionStorage.getItem("user");
    if(!$scope.user || $scope.user=="guest"){
        $scope.user = "guest";
        $scope.logged2=true;
        sessionStorage.setItem("user","guest");
        $scope.homeLink = "#!";
        $scope.isloginLink = "#!login";
        $scope.isloginText = " Please log in";
        $scope.fav = [];
        sessionStorage.setItem("fav",$scope.fav);
    }
    else{
            //getFav();
            $scope.fav=JSON.parse(sessionStorage.getItem("fav"));
            $scope.isloginText = " Logout";
            $scope.homeLink = "#!logged";
            $scope.isloginLink = "#!";
            $scope.countFav = $scope.fav.length;
            $scope.logged2= false;
    }

    $scope.$on('favChanged', function(event,message){
        $scope.fav=JSON.parse(sessionStorage.getItem("fav"));
        $scope.countFav = $scope.fav.length;
    })


    $scope.islogged = function(){
        if($scope.user == "guest"){
            $scope.isloginLink = "#!login";
        }else{
            $scope.user = "guest";
            $scope.logged2=true;
            sessionStorage.setItem("user","guest");
            $scope.homeLink = "#!";
            $scope.isloginLink = "#!";
            $scope.isloginText = " Please log in";
            $scope.fav = [];
            sessionStorage.setItem("fav",$scope.fav);
        }
    }

    




    $scope.isGuest= function(){
        return $scope.logged2;
    }
    

    
});
