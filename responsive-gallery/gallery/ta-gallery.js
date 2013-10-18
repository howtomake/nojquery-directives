/**
 * Created with JetBrains PhpStorm.
 * User: владелец
 * Date: 14.10.13
 * Time: 13:55
 * To change this template use File | Settings | File Templates.
 */
angular.module('ta.gallery',[]).
    /*
    директива для отображения галлерии
    возможные настройки
    1. thumbPixelWidth - ширина миниатюр для отображения с учетом границ в пикселах
    2. showThumbs - показывать или нет миниатюры при старте. Их можно включить также кнопками на верху слайдера
    3. startIndex - индекс картинки в массиве photos, которая будет показана первой.
    обязательный атрибут
    photos - массив объектов, описывающих кадры галлереи в следующем формате:
     {
         thumb:'images/thumbs/1.jpg',       //абсолютный или относительный путь к миниатюре изображения
         large:'images/1.jpg',              //абсолютный или относительный путь к полномасштабному изображению
         description:'description 01',      //описание изображения, выводимое внизу слайдера (не обязательно)
         alt:'image01'                      //описание изображения для соответствующего атрибута изображения (не обязательно)
     }
     */
    directive('taGallery',['$window',function($window){
        return {
            templateUrl:'gallery/t.html',
            scope:{
                photos:'='
            },
            link:function(scope,elm,attrs){
                scope.options = angular.extend({
                    thumbPixelWidth:69,
                    showThumbs:true,
                    startIndex:0
                },scope.$eval(attrs.taGallery));
                var currentIndex = scope.options.startIndex;
                //scope.current = scope.photos ? scope.photos[currentIndex] : null;
                scope.next = function(){
                    scope.set(currentIndex === scope.photos.length-1 ? 0 : currentIndex+1);
                };
                scope.previous = function(){
                    scope.set(currentIndex ? currentIndex-1 : scope.photos.length-1);
                };
                scope.set = function(index){
                    currentIndex = index;
                    scope.current=scope.photos[currentIndex];
                };
                var sliderW = 0;
                var _start = function(){
                    if(!scope.photos){
                        return;
                    }
                    var carousel = angular.element(document.getElementById('es-carousel'));
                    var shildrenCarousel = carousel.children();
                    var $slider, node;
                    for(var i= 0,ii = shildrenCarousel.length; i<ii;i++){
                        node = shildrenCarousel[i];
                        if(node.nodeName==='UL'){
                            $slider = angular.element(node);
                            break;
                        }
                    }
                    sliderW = scope.options.thumbPixelWidth*scope.photos.length;
                    $slider.css({
                        width: sliderW + 'px'
                    });
                    scope.offsetL = 0;
                    scope.offsetR = sliderW-scope.offsetL-document.getElementById('es-carousel').clientWidth;
                };
                var _init = function(){
                    _start();
                    scope.$digest();
                };
                scope.slideNext = function(){
                    var carouselW = document.getElementById('es-carousel').clientWidth;
                    scope.offsetR = sliderW-scope.offsetL-carouselW;
                    if(scope.offsetR>0){
                        var offset = scope.offsetR > carouselW ? carouselW : scope.offsetR;
                        scope.offsetL += offset;
                        scope.offsetR -= offset;
                    }
                };
                scope.slidePrev = function(){
                    var carouselW = document.getElementById('es-carousel').clientWidth;
                    if(scope.offsetL>0){
                        var offset = scope.offsetL > carouselW ? carouselW : scope.offsetL;
                        scope.offsetL -= offset;
                        scope.offsetR += offset;
                    }
                };
                scope.$watch('options.showThumbs', function(newValue, backValue){
                    if(newValue!=backValue){
                        setTimeout(_init,0);
                    }
                });
                scope.$watch('photos',function(newValue){
                    if(newValue){
                        scope.current = newValue[currentIndex];
                        _start();
                    }
                });
                angular.element($window).bind('resize', _init);

                // touch events
                /*elm.find('div.es-carousel>ul').touchwipe({
                    wipeLeft			: function() {
                        scope.$apply(function(){
                            scope.slideNext();
                        });
                    },
                    wipeRight			: function() {
                        scope.$apply(function(){
                            scope.slidePrev();
                        });
                    }
                });*/
                elm.bind('$destroy',function(){
                    angular.element($window).unbind('resize',_init);
                });
            }
        }
    }]);