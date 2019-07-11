angular.module('myApp')
.controller("POICtrl", function ($scope, $http, $window, $rootScope, $route) {
    self = this;
    $scope.$on('ma', function(event, message){
        $scope.user = message.user;
    })

    if($scope.user != "guest"){
        $scope.fav=JSON.parse(sessionStorage.getItem("fav"));
    }
    
    $scope.POIs = [];
    $scope.allPOIs = [];
    $scope.POIsRank = [];
    $scope.rank = [];
    $scope.categories = [];
    $scope.sorts = ["rank"];
    var y = 0;
    $scope.categories.push("show all");
    $http.get('http://localhost:3000/getCategories/').then(function(response){
        for(var i = 0; i < Object.keys(response.data).length; i++){
            $scope.categories.push(response.data[i].Name);
            $http.get('http://localhost:3000/getPOIBy/' + response.data[i].Name).then(function(response1){
                for(var j = 0; j < Object.keys(response1.data).length; j++){
                    $scope.POIs.push(response1.data[j]);
                    $scope.allPOIs.push(response1.data[j]);
                    setTimeout((x, z) => {
                        $http.get('http://localhost:3000/getPOIDetails/' + z).then(function(response2){
                            $scope.POIsRank.push([$scope.allPOIs[x], response2.data[2]]);
                        }, function errorCallback(response3) {
                            console.log(response3);
                        });
                    }, 0, y, response1.data[j].ID);
                    y++;
                }
            });
        }
    });

    function includ(y){
        for(var i=0; i<$scope.POIs.length; i++){
            if($scope.POIs[i].ID==y.ID)
                return true;
        }
        return false;
    }

    $scope.submitSort = function(){
        $scope.POIsRank.sort(function(a, b){return a[1] - b[1]});
        $scope.POIsRank.reverse();
        var x = [];
        for(var i = 0; i< $scope.POIsRank.length; i++){
            var y = $scope.POIsRank[i][0];
            if(includ(y)){
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

    $scope.$on('favChanged', function(event,message){
        $scope.fav=JSON.parse(sessionStorage.getItem("fav"));
    })

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

    function searchID(id){
        for(var i=0; i<$scope.POIs.length; i++){
            if($scope.POIs[i].ID==id){
                return $scope.POIs[i];
            }
        }
    }

    $scope.addfav = function(id){
        if(id == -1){
            id = $scope.POIID;
        }
        $scope.fav.push(searchID(id));
        sessionStorage.setItem("fav",JSON.stringify($scope.fav));
        $rootScope.$broadcast('favChanged',{});
    }

    $scope.removefav = function(id){
        if(id == -1){
            id = $scope.POIID;
        }
       var x=[];
       for(var i=0; i<$scope.fav.length; i++){
           if((id !=-1 && id!=$scope.fav[i].ID) || (id==-1 && $scope.POIID!=$scope.fav[i].ID)){
               x.push($scope.fav[i]);
           }
       }
       $scope.closeModal();
       $scope.fav=x;
       sessionStorage.setItem("fav",JSON.stringify(x));
       $rootScope.$broadcast('favChanged', {
           id: $scope.POIID
       })
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
            if(response.data[3]){
                $scope.rev1 = response.data[3][0] + ",";
                $scope.date1 = response.data[3][1];
                if(response.data[4]){
                    $scope.rev2 = response.data[4][0] + ",";
                    $scope.date2 = response.data[4][1];
                }
                else{
                    $scope.rev2 = "";
                    $scope.date2 = "";
                }
            }
            else{
                $scope.rev1 = "There are no reviews";
                $scope.date1 = "";
                $scope.rev2 = "";
                $scope.date2 = "";
            }
        });
    }

    $scope.closeModal = function(){
        document.getElementById('POI').style.display = "none";
        document.getElementById('review').style.display = "none";
        document.getElementById('revText').value = "";
    }
    
    $window.onclick = function(event) {
        if (event.target == document.getElementById('POI')) {
            document.getElementById('POI').style.display = "none";
        }
        if (event.target == document.getElementById('review')) {
            document.getElementById('review').style.display = "none";
            document.getElementById('revText').value = "";
        }
    }
    
    $window.onkeydown = function(event){
        if(event.code=="Escape"){
            document.getElementById('POI').style.display = "none";
            document.getElementById('review').style.display = "none";
            document.getElementById('revText').value = "";
        }
    }

    $scope.openReview = function(num, name){
        $scope.POIID = num;
        $scope.POIName = name;
        document.getElementById('review').style.display = "block";
    }

    $scope.submitReview = function(){
        var text = $scope.revText;
        if(!text){
            text = "NULL";
        }
        $http.post('http://localhost:3000/addReview',{
            "POIID": $scope.POIID,
            "userName":  $scope.user,
            "review": text,
            "rank": $scope.rank
        }).then(function(response){}, function errorCallback(response) {});
        $window.alert("review added");
        $scope.closeModal();
        $route.reload();
    }

});