
angular.module('myApp')
.controller("3POICtrl", function ($scope, $http, $window) {
    self = this;
    $http.get('http://localhost:3000/getPOI').then(function(response){
        var arr;
        if(Object.keys(response.data).length > 3){
            arr = choose3Rand(Object.keys(response.data).length);
        }
        else{
            arr = [1, 2, 3];
        }
        $scope.POIID1 = response.data[arr[0]].ID;
        $scope.poi1 = response.data[arr[0]].Name;
        $scope.src1 = response.data[arr[0]].Picture;
        if(response.data.length > 1){
            $scope.POIID2 = response.data[arr[1]].ID;
            $scope.poi2 = response.data[arr[1]].Name;
            $scope.src2 = response.data[arr[1]].Picture;
            if(response.data.length > 2){
                $scope.POIID3 = response.data[arr[2]].ID;
                $scope.poi3 = response.data[arr[2]].Name;
                $scope.src3 = response.data[arr[2]].Picture;
            }
        }
    });
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

    function choose3Rand(size){
        var arr =[];
        var x = Math.floor(Math.random()*size);
        while(x == size){
            x = Math.floor(Math.random()*size);
        }
        arr.push(x);
        x = Math.floor(Math.random()*size);
        while(x == size || x == arr[0]){
            x = Math.floor(Math.random()*size);
        }
        arr.push(x);
        x = Math.floor(Math.random()*size);
        while(x == size || x == arr[0] || x == arr[1]){
            x = Math.floor(Math.random()*size);
        }
        arr.push(x);
        return arr;
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

