'use strict';
angular.module('myApp', ['ta.gallery']).
    controller('MyCtrl1',['$scope','$window',function($scope){
        $scope.params={show:true};
        $scope.photos = [
            {
                thumb:'images/thumbs/1.jpg',
                large:'images/1.jpg',
                description:'description 01',
                alt:'image01'
            },{
                thumb:'images/thumbs/2.jpg',
                large:'images/2.jpg',
                description:'description 02',
                alt:'image02'
            },{
                thumb:'images/thumbs/3.jpg',
                large:'images/3.jpg',
                description:'description 03',
                alt:'image03'
            },{
                thumb:'images/thumbs/4.jpg',
                large:'images/4.jpg',
                description:'description 04',
                alt:'image04'
            },{
                thumb:'images/thumbs/5.jpg',
                large:'images/5.jpg',
                description:'description 05',
                alt:'image05'
            },{
                thumb:'images/thumbs/6.jpg',
                large:'images/6.jpg',
                description:'description 06',
                alt:'image06'
            },{
                thumb:'images/thumbs/7.jpg',
                large:'images/7.jpg',
                description:'description 07',
                alt:'image07'
            },{
                thumb:'images/thumbs/8.jpg',
                large:'images/8.jpg',
                description:'description 08',
                alt:'image08'
            }
        ];
    }]);
