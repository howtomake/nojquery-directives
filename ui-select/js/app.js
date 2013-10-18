'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['ta.select']).
    controller('MyCtrl',function($scope){
        var RENT='съем',
            LEASING='сдача',
            SALE = 'продажа',
            PURCHASE = 'покупка',
            SCORE='оценка';
        $scope.types = {
            sale:SALE,
            purchase:{name:PURCHASE, id:1},
            leasing:LEASING,
            rent:RENT,
            score:SCORE
        };
        $scope.options =[{
            name:'one',
            g:3,
            id:1
        },{
            name:'two',
            g:2,
            id:2
        },{
            name:'tree',
            g:1,
            id:3
        },{
            name:'one',
            g:1,
            id:4
        },{
            name:'two',
            g:2,
            id:5
        },{
            name:'tree',
            g:3,
            id:6
        },{
            name:'one',
            g:3,
            id:7
        },{
            name:'two',
            g:1,
            id:8
        },{
            name:'tree',
            g:2,
            id:9
        }];
        $scope.params = {select:2};
        var i = 0;
        $scope.change = function(){
            $scope.params.select =  $scope.typesArray[i++%5];
        };

        $scope.typesArray = [RENT,LEASING,SALE,PURCHASE,SCORE];
    });
