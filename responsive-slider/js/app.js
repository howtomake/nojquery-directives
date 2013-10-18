'use strict';
angular.module('myApp', ['ta.slider']).
    controller('MyCtrl1',['$scope', function($scope){
        $scope.banners = [
            {
                image:{
                    src:'http://placehold.it/940x340/F56EDC/FFFFFF',
                    alt:'image one',
                    link:'#',
                    animate:'fadeIn'
                },
                oneLabel:{
                    text:'text one 1',
                    animate:'fadeInLeftBig'
                },
                twoLabel:{
                    text:'text two 1',
                    animate:'fadeInRightBig'
                }
            },{
                image:{
                    src:'http://placehold.it/940x340/ed1c24/FFFFFF',
                    alt:'image two'
                },
                oneLabel:{
                    text:'text one 2'
                },
                twoLabel:{
                    text:'text two 2'
                }
            },{
                image:{
                    src:'http://placehold.it/940x340/3ED6B3/FFFFFF',
                    alt:'image free'
                },
                oneLabel:{
                    text:'text one 3'
                },
                twoLabel:{
                    text:'text two 3'
                }
            },{
                image:{
                    src:'http://placehold.it/940x340/E37F14/FFFFFF',
                    alt:'image 4'
                },
                oneLabel:{
                    text:'text one 4'
                },
                twoLabel:{
                    text:'text two 4'
                }
            }
        ];
        $scope.show = true;
    }]);
