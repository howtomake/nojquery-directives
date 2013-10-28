/**
 * Created with JetBrains PhpStorm.
 * User: владелец
 * Date: 16.10.13
 * Time: 8:10
 * To change this template use File | Settings | File Templates.
 */
//todo: если уезжаем до конца вправо, тогда слайдер блокируется, т.к. метка назад, находится под вперед
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
                    hasObject = options.hasObject,
                    startKey = hasObject ? 'start' : 0,
                    endKey = hasObject ? 'end' : 1;
                scope.min = min;
                if(min>max){
                    throw new Error('min > max');
                }
                scope.len = max-min;

                var checkOnUndefined = function(){
                    if(scope.model[startKey]===min && scope.model[endKey]===min){
                        scope.model = undefined;
                    }
                };
                var mouseup = function(event){
                    if(angular.isNumber(scope.startDown) || angular.isNumber(scope.endDown)){
                        scope.startDown = scope.endDown = null;
                        scope.model[startKey]=Math.round(scope.current[startKey]);
                        scope.model[endKey]=Math.round(scope.current[endKey]);
                        checkOnUndefined();
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
                        index = name==='startDown'?startKey:endKey;
                        var dif = (event.clientX-scope[name])/ elm.find('div')[0].clientWidth* scope.len;
                        scope[name] = event.clientX;
                        var nValue = scope.current[index]+dif;
                        if(nValue<min){
                            nValue = min;
                        }else if(nValue>max){
                            nValue = max;
                        }
                        if(index===0 || index==='end'){
                            scope.current[index]= nValue < scope.current[startKey] ? scope.current[startKey] : nValue;
                        }else{
                            scope.current[index]= nValue > scope.current[endKey] ? scope.current[endKey] : nValue;
                        }
                        if(!scope.model){
                            scope.model =scope.current;
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
                        scope.current=viewValue = hasObject ? {start:min,end:min} : [min,min];
                    }
                    checkNewValue(viewValue);
                    if(viewValue[startKey]===min && viewValue[endKey] === min){
                        scope.model = undefined;
                        return undefined;
                    }
                    return viewValue;
                });

                var checkNewValue = function(newValue){
                    if(!newValue){return;}
                    var v;
                    if(angular.isUndefined(newValue[startKey])){
                        newValue[startKey]=min;
                    }
                    if(angular.isUndefined(newValue[endKey])){
                        newValue[endKey]=newValue[startKey];
                    }
                    if(newValue[startKey]>newValue[endKey]){
                        v = newValue[startKey];
                        newValue[startKey]=newValue[endKey];
                        newValue[endKey]=v;
                    }
                    if(newValue[startKey]<min){
                        newValue[startKey]=min;
                    }
                    if(newValue[endKey]>max){
                        newValue[endKey]=max;
                    }
                };
                scope.$watch('model',function(newValue){
                    checkNewValue(newValue);
                    scope.current = newValue;
                    ngModel.$setViewValue(newValue);
                });
                var changeRange = function(newValue, key){
                    if(angular.isNumber(newValue)){
                        var value = newValue;
                        if(value<min){
                            value = min;
                        }
                        if(value>max){
                            value = max;
                        }
                        if(key === startKey && value > scope.model[endKey]){
                            scope.model[endKey] = value;
                        }else if(key === endKey && value < scope.model[startKey]){
                            scope.model[startKey] = value;
                        }
                        scope.model[key] = value;
                        if(scope.model[startKey]===min && scope.model[endKey]===min){
                            delete scope.model;
                        }
                    }else{
                        if(scope.model){
                            if(newValue == scope.model[key===startKey ? endKey : startKey]){
                                scope.model = undefined;
                            }else{
                                delete scope.model[key];
                                scope.current[key] = min;
                            }
                        }
                    }
                };
                var changeStart = function(newValue){
                    changeRange(newValue, startKey);
                };
                var changeEnd = function(newValue){
                    changeRange(newValue, endKey);
                };
                if(hasObject){
                    scope.$watch('model["'+startKey + '"]',changeStart);
                    scope.$watch('model["'+endKey + '"]',changeEnd);
                }else{
                    scope.$watch('model['+startKey + ']',changeStart);
                    scope.$watch('model['+endKey + ']',changeEnd);
                }


                var destroy = function(){
                    elm.unbind('$destroy',destroy);
                    html.unbind('mouseup',mouseup);
                    html.unbind('mousemove',mousemove);
                };
                elm.bind('$destroy',destroy);
            }
        }
    }]);