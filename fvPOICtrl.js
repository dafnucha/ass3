angular.module('myApp')
.controller("fvPOICtrl", function ($scope, $http, $window, $rootScope) {

    $scope.databaseFav = [];
    $scope.fav = [];
    
    $scope.$on('mb', function(event, message){
        $scope.user = message.user;
    })

    if($scope.user != "guest"){
        $rootScope.$broadcast('requestFav', {})
    }

    $scope.$on('sendFav', function(event, message){
        $scope.fav.push(message.fav);
    })

    $scope.remove = function(id){
        $scope.fav = [];
        if(id == -1){
            $rootScope.$broadcast('removeFromFav', {
                id: $scope.POIID
            })
        }
        else{
            $rootScope.$broadcast('removeFromFav', {
                id: $scope.POIID
            })
        }
    }

    if($scope.user != "guest" ){
        $http.get('http://localhost:3000/getFavorite/' +  $scope.user).then(function(response){
            $scope.databaseFav = response.data;
        });
    }

    $scope.hideText = function(){
        return $scope.fav.length != 0;
    }


    $scope.openPOI = function(num, name){
        $scope.POIID = num;
        $scope.POIName = name;
        document.getElementById('POI').style.display = "block";
        $http.get('http://localhost:3000/getPOIDetails/' + num).then(function(response){
            $scope.numOfViews = response.data[0];
            $scope.descr = response.data[1];
            $scope.rank = response.data[2];
            $scope.rev1 = response.data[3][0];
            $scope.date1 = response.data[3][1];
            $scope.rev2 = response.data[4][0];
            $scope.date2 = response.data[4][1];
            
        });
    }

    $scope.removefav = function(id){

    }

    $scope.closeModal = function(){
        document.getElementById('POI').style.display = "none";
    }
    
    $window.onclick = function(event) {
        if (event.target == document.getElementById('POI')) {
            document.getElementById('POI').style.display = "none";
        }
    }
    
    $window.onkeydown = function(event){
        if(event.code=="Escape"){
            document.getElementById('POI').style.display = "none";
        }
    }
});