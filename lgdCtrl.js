
angular.module('myApp')
.controller("lgdCtrl", function ($scope, $http, $window, $route) {
    $scope.$on('ma', function(event, message){
        $scope.user = message.user;
    })
    $http.get('http://localhost:3000/showPOI/'+ $scope.user).then(function(response){
        var arr;
        $scope.POIID1 = response.data[0][0];
        $scope.poi1 = response.data[0][1];
        $scope.src1 = response.data[0][2];
        $scope.POIID2 = response.data[1][0];
        $scope.poi2 = response.data[1][1];
        $scope.src2 = response.data[1][2];
    });
/*
    $http.get('http://localhost:3000/showSavedPOI/'+ $scope.user).then(function(response){
        var fav = JSON.parse(sessionStorage.getItem("fav"));
        if(Object.keys(response.data).length == 0){
            $scope.hideText1 = "false";
            $scope.hidePOI11 = "true";
            $scope.hidePOI21 = "true";
        }
        else if(Object.keys(response.data).length == 1){
            if(fav.contain(fav, response.data[0].ID)){
                $scope.hideText1 = "true";
                $scope.hidePOI11 = "false";
                $scope.hidePOI21 = "true";
                $scope.poi3 = response.data[0].Name;
                $scope.src3 = response.data[0].Picture;
                $scope.POIID3 = response.data[0].ID;
            }
            else if(fav.length > 1){
                $scope.hideText1 = "true";
                $scope.hidePOI11 = "false";
                $scope.hidePOI21 = "false";
                $scope.poi3 = fav[fav.length-1].Name;
                $scope.src3 = fav[fav.length-1].Picture;
                $scope.POIID3 = fav[fav.length-1].ID;
                $scope.poi4 = fav[fav.length-2].Name;
                $scope.src4 = fav[fav.length-2].Picture;
                $scope.POIID4 = fav[fav.length-2].ID;
            }
            else if(fav.length == 1){
                $scope.hideText1 = "true";
                $scope.hidePOI11 = "false";
                $scope.hidePOI21 = "true";
                $scope.poi3 = fav[0].Name;
                $scope.src3 = fav[0].Picture;
                $scope.POIID3 = fav[0].ID;
            }
            else{
                $scope.hideText1 = "false";
                $scope.hidePOI11 = "true";
                $scope.hidePOI21 = "true";
            }
        }
        else{
            if(contain(fav, response.data[0].ID) && contain(fav, response.data[1].ID)){
                $scope.hideText1 = "true";
                $scope.hidePOI11 = "false";
                $scope.hidePOI21 = "true";
                $scope.poi3 = response.data[0].Name;
                $scope.src3 = response.data[0].Picture;
                $scope.POIID3 = response.data[0].ID;
            }

        }            else if(fav.length > 1){
            $scope.hideText1 = "true";
            $scope.hidePOI11 = "false";
            $scope.hidePOI21 = "false";
            $scope.poi3 = fav[fav.length-1].Name;
            $scope.src3 = fav[fav.length-1].Picture;
            $scope.POIID3 = fav[fav.length-1].ID;
            $scope.poi4 = fav[fav.length-2].Name;
            $scope.src4 = fav[fav.length-2].Picture;
            $scope.POIID4 = fav[fav.length-2].ID;
        }
        else if(fav.length == 1){
            $scope.hideText1 = "true";
            $scope.hidePOI11 = "false";
            $scope.hidePOI21 = "true";
            $scope.poi3 = fav[0].Name;
            $scope.src3 = fav[0].Picture;
            $scope.POIID3 = fav[0].ID;
        }
        else{
            $scope.hideText1 = "false";
            $scope.hidePOI11 = "true";
            $scope.hidePOI21 = "true";
        }
    });
*/


    if(sessionStorage.getItem("fav")){
        var fav = JSON.parse(sessionStorage.getItem("fav"));
        if(fav.length > 1){
            $scope.hideText1 = "true";
            $scope.hidePOI11 = "false";
            $scope.hidePOI21 = "false";
            $scope.poi3 = fav[fav.length-1].Name;
            $scope.src3 = fav[fav.length-1].Picture;
            $scope.POIID3 = fav[fav.length-1].ID;
            $scope.poi4 = fav[fav.length-2].Name;
            $scope.src4 = fav[fav.length-2].Picture;
            $scope.POIID4 = fav[fav.length-2].ID;
        }
        else if(fav.length == 1){
            $scope.hideText1 = "true";
            $scope.hidePOI11 = "false";
            $scope.hidePOI21 = "true";
            $scope.poi3 = fav[0].Name;
            $scope.src3 = fav[0].Picture;
            $scope.POIID3 = fav[0].ID;
        }
        else{
            $scope.hideText1 = "false";
            $scope.hidePOI11 = "true";
            $scope.hidePOI21 = "true";
        }
    }
    setTimeout(() => {
        if(sessionStorage.getItem("ref") == "true"){
            $route.reload();
            sessionStorage.setItem("ref", "false");
        }
    }, 300)


    $scope.hideText = function(){
        return $scope.hideText1 == "true";
    }
    $scope.hidePOI1 = function(){
        return $scope.hidePOI11 == "true";
    }
    $scope.hidePOI2 = function(){
        return $scope.hidePOI21 == "true";
    }
    $scope.openPOI = function(num){
        document.getElementById('POI').style.display = "block";
        var POIID;
        if(num == 1){
            POIID = $scope.POIID1;
            $scope.POIName = $scope.poi1;
        }
        else if(num == 2){
            POIID = $scope.POIID2;
            $scope.POIName = $scope.poi2;
        }
        else{
            POIID = $scope.POIID3;
            $scope.POIName = $scope.poi3;
        }
        $http.get('http://localhost:3000/getPOIDetails/'+POIID).then(function(response){
            $scope.numOfViews = response.data[0];
            $scope.descr = response.data[1];
            $scope.rank = response.data[2];
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

