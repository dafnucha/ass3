angular.module('myApp')
.controller("POICtrl", function ($scope, $http, $window) {
    /*
    $scope.cancel = function(){
        $mod.dismiss('cancel');
    }
    */
    $scope.POIs = [];
    $scope.categories = [];
    $scope.sorts = ["Alphabetical order", "rank"];
    $http.get('http://localhost:3000/getCategories/').then(function(response){
    for(var i = 0; i < Object.keys(response.data).length; i++){
        $scope.categories.push(response.data[i].Name);
        $http.get('http://localhost:3000/getPOIBy/' + response.data[i].Name).then(function(response1){
            for(var j = 0; j < Object.keys(response1.data).length; j++){
                 $scope.POIs.push(response1.data[j]);
            }
         });
    }
    });

    $scope.submitSort = function(){
        if($scope.sort == "rank"){
            sortByRank();
        }
        else{
            sort();
        }
    }
/////////////////////////////////////////////////////////////////////////////////////////////
    function sortByRank(){
        var arr = [];
        var temp = $scope.POIs;
        for(var i = 0; i < temp.length; i++){
            var num = temp[i].ID;
            $http.get('http://localhost:3000/getPOIDetails/' + num).then(function(response){
                var x ={
                    "POI": temp[i],
                    "rank": response.data[2]
                };
                arr.push(x);
            },
            function(data) {
                console.log(data);
            });
        }
        arr.sort(function(a, b){return a.rank - b.rank});
        $scope.POIs = []
        for(var i = 0; i< arr.length; i++){
            $scope.POIs.push(arr[i].POI);
        }
    }

    function sort(){
        $scope.POIs.sort(function(a, b){return a -b});
    }

    $scope.submit = function(){
        var x = [];
        $http.get('http://localhost:3000/getPOIBy/' + $scope.category).then(function(response){
            for(var i = 0; i < Object.keys(response.data).length; i++){
                 x.push(response.data[i]);
            }
        });
        $scope.POIs = x;
    }

    $scope.openPOI = function(num){
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