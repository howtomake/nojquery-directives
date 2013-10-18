/**
 * Created with JetBrains PhpStorm.
 * User: владелец
 * Date: 16.10.13
 * Time: 8:10
 * To change this template use File | Settings | File Templates.
 */
angular.module('ta.uiSlider',[]).
    value('taUiSliderOptions',{
        hasObject:true, //переводит слайдеры в режим отображения значений в объектах
        templatePaths:['ui-slider/t.html','ui-slider/t-object.html']
    }).
    /*
    директива для выбора диапазона значений, в ng-model сохраняется результат.
    Возможные атрибуты
    1. min - минимальное возможное значение
    2. max - максимально возможное значение
     */
    directive('taUiSlider',['taUiSliderOptions',function(options){
        return {
            templateUrl:options.templatePaths[options.hasObject ? 1 : 0],
            require:'ngModel',
            scope:{
                model:'=ngModel'
            },
            link:function(scope,elm,attrs,ngModel){
                var min = Number(attrs.min) || 0,
                    max = Number(attrs.max) || 1000,
                    html = angular.element(document.getElementsByTagName('html')[0]),
                    hasObject = options.hasObject;

                if(min>max){
                    throw new Error('min > max');
                }
                scope.len = max-min;

                var mouseup = function(event){
                    if(angular.isNumber(scope.startDown) || angular.isNumber(scope.endDown)){
                        scope.startDown = scope.endDown = null;
                        if(hasObject){
                            scope.model.start=Math.round(scope.model.start);
                            scope.model.end=Math.round(scope.model.end);
                        }else{
                            scope.model[0]=Math.round(scope.model[0]);
                            scope.model[1]=Math.round(scope.model[1]);
                        }
                        scope.$digest();
                        if(event.preventDefault){
                            event.preventDefault();
                        }else{
                            event.returnValue=false;
                        }
                    }
                };
                var mousemove = function(event){
                    var process = function(name){
                        var index;
                        if(hasObject){
                            index = name==='startDown'?'start':'end';
                        }else{
                            index = name==='startDown'?0:1;
                        }
                        var dif = (event.clientX-scope[name])/ elm.find('div')[0].clientWidth* scope.len;
                        scope[name] = event.clientX;
                        var nValue = scope.model[index]+dif;
                        if(nValue<min){
                            nValue = min;
                        }else if(nValue>max){
                            nValue = max;
                        }
                        if(index===0 || index==='end'){
                            if(hasObject){
                                scope.model[index]= nValue < scope.model.start ? scope.model.start : nValue;
                            }else{
                                scope.model[index]= nValue < scope.model[0] ? scope.model[0] : nValue;
                            }
                        }else{
                            if(hasObject){
                                scope.model[index]= nValue > scope.model.end ? scope.model.end : nValue;
                            }else{
                                scope.model[index]= nValue > scope.model[1] ? scope.model[1] : nValue;
                            }
                        }
                        if(event.preventDefault){
                            event.preventDefault();
                        }else{
                            event.returnValue=false;
                        }
                    };
                    scope.$apply(function(){
                        if(angular.isNumber(scope.startDown)){
                            process('startDown');
                        }else if(angular.isNumber(scope.endDown)){
                            process('endDown');
                        }
                    });
                };
                html.bind('mouseup',mouseup);
                html.bind('mousemove',mousemove);
                scope.mousedown = function($event, name){
                    scope[name]=$event.clientX;
                    if($event.preventDefault){
                        $event.preventDefault();
                    }else{
                        $event.returnValue = false;
                    }
                };

                ngModel.$parsers.unshift(function(viewValue){
                    if(!viewValue){
                        if(hasObject){
                            scope.model=viewValue = {start:min,end:max};
                        }else{
                            scope.model=viewValue = [min,max];
                        }
                    }
                    var v;
                    if(hasObject){
                        if(angular.isUndefined(viewValue.start)){
                            viewValue.start=min;
                        }
                        if(angular.isUndefined(viewValue.end)){
                            viewValue.end=max;
                        }
                        if(viewValue.start>viewValue.end){
                            v = viewValue.start;
                            viewValue.start=viewValue.end;
                            viewValue.end=v;
                        }
                        if(viewValue.start<min){
                            viewValue.start=min;
                        }
                        if(viewValue.end>max){
                            viewValue.end=max;
                        }
                    }else{
                        if(angular.isUndefined(viewValue[0])){
                            viewValue[0]=min;
                        }
                        if(angular.isUndefined(viewValue[1])){
                            viewValue[1]=max;
                        }

                        if(viewValue[0]>viewValue[1]){
                            v = viewValue[0];
                            viewValue[0]=viewValue[1];
                            viewValue[1]=v;
                        }
                        if(viewValue[0]<min){
                            viewValue[0]=min;
                        }
                        if(viewValue[1]>max){
                            viewValue[1]=max;
                        }
                    }
                    return viewValue;
                });
                scope.$watch('model',function(newValue){
                     ngModel.$setViewValue(newValue);
                });

                var destroy = function(){
                    elm.unbind('$destroy',destroy);
                    html.unbind('mouseup',mouseup);
                    html.unbind('mousemove',mousemove);
                };
                elm.bind('$destroy',destroy);
            }
        }
    }]);