angular.module('myApp')
.controller("POICtrl", function ($scope, $http, $window) {
    /*
    $scope.cancel = function(){
        $mod.dismiss('cancel');
    }
    */
    self = this;
    $scope.$on('ma', function(event, message){
        $scope.user = message.user;
    })

    if($scope.user != "guest"){
        $http.get('http://localhost:3000/getFavorite/' +  $scope.user).then(function(response){
            $scope.fav = response.data;
        });
    }
    
    $scope.POIs = [];
    $scope.allPOIs = [];
    $scope.POIsRank = [];
    $scope.rank = [];
    $scope.categories = [];
    $scope.sorts = ["rank"];
    $scope.categories.push("show all");
    $http.get('http://localhost:3000/getCategories/').then(function(response){
        for(var i = 0; i < Object.keys(response.data).length; i++){
            $scope.categories.push(response.data[i].Name);
            $http.get('http://localhost:3000/getPOIBy/' + response.data[i].Name).then(function(response1){
                for(var j = 0; j < Object.keys(response1.data).length; j++){
                    $scope.POIs.push(response1.data[j]);
                    $scope.allPOIs.push(response1.data[j]);
                    $http.get('http://localhost:3000/getPOIDetails/' + response1.data[j].ID).then(function(response2){
                        $scope.rank.push(response2.data[2]);
                    }, function errorCallback(response3) {
                        console.log(response3);
                    });
                }
            });
        }
    });

    setTimeout(() =>{
        for(var i = 0; i < $scope.rank.length; i++){
            $scope.POIsRank.push([$scope.allPOIs[i], $scope.rank[i]]);
        }
    }, 4000)
    $scope.submitSort = function(){
        $scope.POIsRank.sort(function(a, b){return a[1] - b[1]});
        $scope.POIsRank.reverse();
        var x = [];
        for(var i = 0; i< $scope.POIsRank.length; i++){
            var y = $scope.POIsRank[i][0];
            if($scope.POIs.includes(y)){
                x.push(y);
            }
        }
        $scope.POIs = x;
    }

    $scope.submitsearch = function(){
        var x = [];
        for(var i = 0; i < $scope.allPOIs.length; i++){
            if($scope.allPOIs[i].Name.includes($scope.search.toUpperCase()) || $scope.allPOIs[i].Name.includes($scope.search.toLowerCase())){
               x.push($scope.allPOIs[i]);
            }
        }
        $scope.POIs = x;
    }

    $scope.hideText = function(){
        return $scope.POIs.length != 0;
    }

    $scope.isguest = function(id){
        if($scope.user == "guest"){
            return true;
        }
        else{
            if(id == -1){
                id = $scope.POIID;
            }
            if($scope.fav){
                for(var i = 0; i < $scope.fav.length; i++){
                    if($scope.fav[i].ID == id){
                        return true;
                    }
                }
                return false;
            }
            return true;
        }
    }

    $scope.isfav = function(id){
        if($scope.user == "guest"){
            return true;
        }
        else{
            if(id == -1){
                id = $scope.POIID;
            }
            if($scope.fav){
                for(var i = 0; i < $scope.fav.length; i++){
                    if($scope.fav[i].ID == id){
                        return false;
                    }
                }
                return true;
            }
            return true;
        }
    }

    $scope.addfav = function(id){
        if(id == -1){
            id = $scope.POIID;
        }
        $http.post('http://localhost:3000/addToFavorite',
            {"POIID": id,
            "userName": $scope.user
            }).then(function(response){ 
                $window.alert("POI added to favorite");
                $http.get('http://localhost:3000/getFavorite/' +  $scope.user).then(function(response){
                    $scope.fav = response.data;
                });
            }, function errorCallback(response) {
        });
    }

    $scope.removefav = function(id){
        if(id == -1){
            id = $scope.POIID;
        }
        var req = {
            method: 'DELETE',
            url: 'http://localhost:3000/removeFromFavorite',
            headers: {
                'Content-Type': "application/json"
            },
            data: {
                "POIID": id,
                "userName": $scope.user
            }
        }
        $http(req).then(function(response){ 
            $window.alert("POI removed from favorite");
            $http.get('http://localhost:3000/getFavorite/' +  $scope.user).then(function(response){
                $scope.fav = response.data;
            });
        }, function errorCallback(response) {}
        );
    }

    $scope.submit = function(){
        if($scope.category == "show all"){
            for(var i = 0; i < $scope.categories.length; i++){
                $http.get('http://localhost:3000/getPOIBy/' + $scope.categories[i]).then(function(response){
                    for(var i = 0; i < Object.keys(response.data).length; i++){
                         $scope.POIs.push(response.data[i]);
                    }
                 });
            }
        }
        else{
            var x = [];
            $http.get('http://localhost:3000/getPOIBy/' + $scope.category).then(function(response){
                for(var i = 0; i < Object.keys(response.data).length; i++){
                    x.push(response.data[i]);
                }
            });
            $scope.POIs = x;
        }
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