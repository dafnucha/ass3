angular.module('myApp')
.controller("POICtrl", function ($scope, $http, $mod) {
    $scope.cancel = function(){
        $mod.dismiss('cancel');
    }
});