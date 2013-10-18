/**
 * Created with JetBrains PhpStorm.
 * User: владелец
 * Date: 15.10.13
 * Time: 13:53
 * To change this template use File | Settings | File Templates.
 */
angular.module('ta.slider',[]).
    /*
    Директива для организации слайд шоу
    Возможные настройки
    1. width - максимальная ширина отображения для слайдера в пикселах, обычно равна ширине картинок.
    2. showArror - показывать или нет кнопки навигации вперед и назад
    3. showButton - показывать или нет панель с точками для выбора определенного слайда.
    4. slideShow - включает режим слайд-шоу.
    5. slideShowDelay - время в течении которого транслируется слайд при слайд-шоу.
    6. autoHideButton - если задано, то кнопки скрываются при выходе курсора за пределы слайдера.
    Требуемый атрибут
    banners - массив объектов, описывающих слайды в следующем формате:
     {
         image:{
             src:'http://placehold.it/940x340/F56EDC/FFFFFF', //относительный или абсолютный путь к изображению слайда
             alt:'image one',                                 //описание картинки
             link:'http://yandex.ru',                         //не обязательный атрибут, ссылка для перехода по нажатию
             animate:'fadeIn'                                 //не обязательный атрибут, задает используемую анимацию
                                                              //   при трансляции слайдера
         },
         oneLabel:{
             text:'text one 1',                               //текст первой метки
             animate:'fadeInLeftBig'                          //не обязательный атрибут, анимация отображения метки
         },
         twoLabel:{
             text:'text two 1',                               //текст второй метки
             animate:'fadeInRightBig'                         //не обязательный атрибут, анимация отображения метки
         }
     }
     */
    directive('taSlider',[function(){
        var animateArr = [
            'rollIn', 'fadeIn', 'fadeInUp', 'fadeInDown', 'fadeInLeft', 'fadeInRight', 'fadeInRight', 'bounceIn',
            'bounceInDown', 'bounceInUp', 'bounceInLeft', 'bounceInRight', 'rotateIn', 'rotateInDownLeft',
            'rotateInDownRight', 'rotateInUpLeft', 'rotateInUpRight', 'fadeInLeftBig', 'fadeInRightBig', 'fadeInUpBig',
            'fadeInDownBig', 'flipInX', 'flipInY', 'lightSpeedIn'
        ];
        var defaultSettings = {
            width: 940,
            showArrow: true,
            showButton: true,
            slideShow: true,
            slideShowDelay: 5000,
            autoHideButton: true
        };
        var getAnimate = function(val){
            if(val) return val;
            var max = animateArr.length- 1, min=0;
            var res = Math.floor(Math.random() * (max - min + 1)) + min;
            return res > max ? animateArr[max] : animateArr[res];
        };

        return {
            templateUrl:'slider/t.html',
            scope:{
                banners:'='
            },
            link:function(scope, elm, attrs){
                scope.settings = angular.extend({},defaultSettings,scope.$eval(attrs.taSlider));
                var currentIndex = 0;
                setTimeout(function(){
                    angular.element(document.getElementById('slide-wrapper')).css({
                        "max-width":scope.settings.width + 'px'
                    });
                });
                if(!scope.settings.autoHideButton){
                    scope.buttonsAnimate = 'fadeIn';
                }
                scope.mouseLeave = function(){
                    if(scope.settings.autoHideButton){
                        scope.buttonsAnimate='fadeOut';
                    }
                    slideShowRun();
                };
                scope.mouseEnter = function(){
                    scope.buttonsAnimate='fadeIn';
                    slideShowStop();
                };
                scope.set = function(index){
                    var isCurrent = !!scope.current;
                    currentIndex = index;
                    if(isCurrent){
                        scope.fadeAnimate = 'fadeOutLeftBig';
                        setTimeout(function(){
                            scope.current = scope.banners[currentIndex];
                            scope.fadeAnimate= getAnimate(scope.current.image.animate);
                            scope.labelOneAnimate = getAnimate(scope.current.oneLabel.animate);
                            scope.labelTwoAnimate = getAnimate(scope.current.twoLabel.animate);
                            scope.$digest();
                        },600);
                    }else{
                        scope.current = scope.banners[currentIndex];
                        scope.fadeAnimate = getAnimate(scope.current.image.animate);
                        scope.labelOneAnimate = getAnimate(scope.current.oneLabel.animate);
                        scope.labelTwoAnimate = getAnimate(scope.current.twoLabel.animate);
                    }
                };
                scope.prev = function(){
                    var index = currentIndex === 0 ? scope.banners.length-1 : currentIndex-1;
                    scope.set(index);
                };
                scope.next = function(){
                    var index = currentIndex === scope.banners.length-1 ? 0 : currentIndex+1;
                    scope.set(index);
                };
                scope.set(currentIndex);
                var interval,
                    slideShowRun = function(){
                        if(scope.settings.slideShow){
                            interval = setInterval(function(){
                                scope.$apply(function(){
                                    scope.next();
                                });
                            }, scope.settings.slideShowDelay);
                        }
                    },
                    slideShowStop = function(){
                        if(interval) clearInterval(interval);
                    };
                slideShowRun();
                angular.element(elm).bind('$destroy',function(){
                    slideShowStop();
                });
            }
        };
    }]);