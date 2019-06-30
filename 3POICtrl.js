
angular.module('myApp',['ui.bootstrap'])
.controller("3POICtrl", function ($scope, $http, $modal) {
    self = this;
    $http.get('http://localhost:3000/getPOI').then(function(response){
        $scope.poi1 = response.data[0].Name;
        $scope.src1 = response.data[0].Picture;
    });
    $scope.openPOI = function(){
        var mod = $modal.open({
            templateUrl: 'POI.html',
            controller: 'POICtrl'
        });
    };
});

