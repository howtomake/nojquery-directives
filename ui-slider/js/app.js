'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['ta.uiSlider']).
    controller('MyCtrl',['$scope',function($scope){
        $scope.params={range2:{start:10, end:100}};
        var i=0;
        $scope.setRange = function(){
            switch(i%4){
                case 0:
                    $scope.params.range = [50,25];
                    break;
                case 1:
                    $scope.params.range = [10];
                    break;
                case 2:
                    $scope.params.range = [10, 100];
                    break;
                case 3:
                    delete $scope.params.range;
                    break;
            }
            i++;
        };
    }]);
