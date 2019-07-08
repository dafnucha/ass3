angular.module('myApp')
.controller("fvPOICtrl", function ($scope, $http, $window, $rootScope) {
    
    $scope.databaseFav = [];
    $scope.favorite = JSON.parse(sessionStorage.getItem("fav"));
    
    $scope.$on('mb', function(event, message){
        $scope.user = message.user;
    })

    $scope.remove = function(id){
        var x=[];
        for(var i=0; i<$scope.favorite.length; i++){
            if((id !=-1 && id!=$scope.favorite[i].ID) || (id==-1 && $scope.POIID!=$scope.favorite[i].ID)){
                x.push($scope.favorite[i]);
            }
        }
        $scope.closeModal();
        $scope.favorite=x;
        sessionStorage.setItem("fav",JSON.stringify(x));
        $rootScope.$broadcast('favChanged', {
            id: $scope.POIID
        })
       
    }

    $scope.$on('favChanged', function(event,message){
        $scope.favorite=JSON.parse(sessionStorage.getItem("fav"));

    })

    $scope.POIsRank = [];
    $scope.rank = [];
    $scope.categories = [];
    $scope.sorts = ["rank"];
    $scope.categories.push("show all");
    $http.get('http://localhost:3000/getCategories/').then(function(response){
        for(var i = 0; i < Object.keys(response.data).length; i++){
            $scope.categories.push(response.data[i].Name);
        }
    });
    var x = 0;
    for(var i=0; i<$scope.favorite.length; i++){
        setTimeout((x) => {
            $http.get('http://localhost:3000/getPOIDetails/' + $scope.favorite[x].ID).then(function(response2){
                $scope.POIsRank.push([response2.data[2], $scope.favorite[x]]);
            }, function errorCallback(response3) {
                console.log(response3);
            });
        }, 0, i)

    }

    
    function includ(y){
        for(var i=0; i<$scope.favorite.length; i++){
            if($scope.favorite[i].ID==y.ID)
                return true;
        }
        return false;
    }

    $scope.submitSort = function(){
        $scope.POIsRank.sort(function(a, b){return a[0] - b[0]});
        $scope.POIsRank.reverse();
        var x = [];
        for(var i = 0; i< $scope.POIsRank.length; i++){
            var y = $scope.POIsRank[i][1];
            if(includ(y)){
                x.push(y);
            }
        }
        $scope.favorite = x;
    }


    $scope.submit = function(){
        if($scope.category == "show all"){
            $scope.favorite=JSON.parse(sessionStorage.getItem("fav"));
        }
        else{
            var x = [];
            $scope.favorite=JSON.parse(sessionStorage.getItem("fav"));
            $http.get('http://localhost:3000/getPOIBy/' + $scope.category).then(function(response){
                for(var i = 0; i < Object.keys(response.data).length; i++){
                    var y=response.data[i];
                    if(includ(y))
                        x.push(y);
                }
                $scope.favorite = x;
            });

        }
    }

    if($scope.user != "guest" ){
        $http.get('http://localhost:3000/getFavorite/' +  $scope.user).then(function(response){
            $scope.databaseFav = response.data;
        });
    }

    $scope.hideText = function(){
        return $scope.favorite.length != 0;
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