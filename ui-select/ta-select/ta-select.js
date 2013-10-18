/**
 * Created with JetBrains PhpStorm.
 * User: владелец
 * Date: 17.10.13
 * Time: 10:10
 * To change this template use File | Settings | File Templates.
 */
"use strict";
angular.module('ta.select',[]).
    value('taSelectOptions',{
        templatePath:'ta-select/t.html',
        partPaths:[
            'ta-select/group-zero.html',
            'ta-select/group-one.html',
            'ta-select/group-two.html',
            'ta-select/group-three.html',
            'ta-select/group-four.html',
            'ta-select/group-five.html',
            'ta-select/group-six.html',
            'ta-select/group-seven.html'
        ],
        label:'$value', //в качестве надписи при выборе задается значение в массиве или в объекте
        value:'$key',    //в качестве возвращаемого значения задается ключ в массиве или объекте источнике
        showClear:false  //по умолчанию не показывать кнопку очистки текущего выбранного значения
    }).
    /*
     Директива для выбора значений, допустимые атрибуты
     1. required и ng-required
     2. disabled и ng-disabled
     Допустимые параметры
     1. label - задаем имя свойства для отображения в качестве метки.
        Допустимые значения '$key', '$value', '$value.[property]'
     2. showClear - если установленно, тогда показывается кнопка очистки результата выбора
     3. groups - если задано, тогда проводится группировка значений на основе путей к полям, заданных в данном массиве.
     4. ng-model - результат выбора
     5. source - массив или объект для выбора из него значений
     6. value - значение которое будет установленно в качестве результата выбора.
        Допустимые значения '$key', '$value', '$value.[property]'
     */
    directive('taSelect',['taSelectOptions',function(defaultOptions){
        var getPropertyValue = function(object, path){
                var pathParts = path.split('.'), prop, current = object;
                for(var i= 1,ii=pathParts.length;i<ii;i++){
                    prop = pathParts[i];
                    if(angular.isDefined(current[prop])){
                        current = current[prop];
                    }else{
                        return undefined;
                    }
                }
                return current;
            },
            filter = function(objects, path, value){
                var obj;
                if(angular.isArray(objects)){
                    for (var i = 0, ii = objects.length; i < ii; i++) {
                        obj = objects[i];
                        if(angular.equals(getPropertyValue(obj, path),value)){
                            return obj;
                        }
                    }
                }else if(angular.isObject(objects)){
                    for(var key in objects){
                        if(objects.hasOwnProperty(key)){
                            obj = objects[key];
                            if(angular.equals(getPropertyValue(obj, path),value)){
                                return key;
                            }
                        }
                    }
                }
                return undefined;
            },
            getKey = function(object, value){
                for(var key in object){
                    if(object.hasOwnProperty(key) && angular.equals(object[key],value)){
                        return key;
                    }
                }
                return undefined;
            };
        return {
            templateUrl:defaultOptions.templatePath,
            scope:{
                model:'=ngModel',
                source:'=',
                ngDisabled:'&',
                ngRequired:'&'
            },
            require:'ngModel',
            link:function(scope,elm,attrs,ngModel){
                elm.css({
                    position:'relative'
                });
                var options = angular.extend({}, defaultOptions, scope.$eval(attrs.taSelect));
                //возможны варианты использования в качестве источника массива строк, массива объектов, объекта
                var createGroups = function(){
                    var addGroup = function(object){
                        var groupPath, currentValue, current = scope.groups;
                        for (var i = 0, ii = options.groups.length; i < ii; i++) {
                            groupPath = '$value.' +  options.groups[i];
                            currentValue = getPropertyValue(object,groupPath);
                            if(!current[currentValue]){
                                current[currentValue]= i+1===ii ? [] : {};
                            }
                            current = current[currentValue];
                        }
                        current.push(object);
                    };
                    if(options.groups){
                        scope.groups = {};
                        if(angular.isArray(scope.source)){
                            for(var i = 0,ii=scope.source.length;i<ii;i++){
                                addGroup(scope.source[i]);
                            }
                        }else if(angular.isObject(scope.source)){
                            for(var key in scope.source){
                                if(scope.source.hasOwnProperty(key)){
                                    addGroup(scope.source[key]);
                                }
                            }
                        }else{
                            throw new Error('not correct argument type');
                        }
                    }
                };
                var init = function(){
                    //console.log(scope.model);
                    //инициализация при старте
                    if(angular.isDefined(scope.model)){
                        if(!scope.current)
                            scope.current = {};
                        scope.current.value=scope.model
                        if(options.label===options.value){
                            scope.current.label = scope.current.value;
                        }else{
                            var obj;
                            if(angular.isArray(scope.source)){
                                obj = options.value==='$key' ?
                                    scope.source[scope.current.value]:
                                    filter(scope.source,options.value,scope.current.value);
                                scope.current.label = options.label==='$key' ?
                                    scope.source.indexOf(obj):
                                    getPropertyValue(obj,options.label);
                            }else if(angular.isObject(scope.source)){
                                //если источник объект
                                if(options.value==='$key'){
                                    //value="$key" and label="$value"
                                    obj = scope.source[scope.current.value];
                                    scope.current.label = getPropertyValue(obj,options.label);
                                }else if(options.label==='$key'){
                                    //value="$value" and label="$key"
                                    scope.current.label = filter(scope.source, options.value, scope.current.value);
                                }else{
                                    //value="$value.name" and label="$value.id"
                                    var index = filter(scope.source, options.value, scope.current.value);
                                    obj = scope.source[index];
                                    scope.current.label = getPropertyValue(obj,options.label);
                                }
                            }else{
                                throw new Error('not correct source type');
                            }
                        }

                    }else{
                        delete scope.current;
                    }
                };
                var start = function(){
                    init();
                    createGroups();
                };

                scope.placeholder = attrs.placeholder;
                scope.getLabel = function(object){
                    return getPropertyValue(object,options.label);
                };
                scope.$watch('model',function(newValue,backValue){
                    if(!angular.equals(newValue,backValue)){
                        init();
                    }
                    ngModel.$setViewValue(newValue);
                });

                scope.setSelect = function(val){
                    if(val){
                        if(options.value==='$key'){
                            scope.model = angular.isArray(scope.source) ? scope.source.indexOf(val) : getKey(scope.source, val);
                        }else{
                            scope.model = getPropertyValue(val, options.value);
                        }
                    }else{
                        scope.model = val;
                    }
                    scope.opened = false;
                };
                scope.clear = function(event){
                    scope.setSelect(undefined);
                    event.stopPropagation();
                };
                scope.dropDown = function(){
                    if(!scope.disabled){
                        scope.opened=!scope.opened
                    }
                };

                var getParent = function(target){
                    var parent = target;
                    while(parent[0].tagName!=='LI'){
                        parent = parent.parent();
                    }
                    return parent;
                };
                scope.mouseEnter = function(event){
                    var target = event.target ? angular.element(event.target) : angular.element(event.srcElement);
                    getParent(target).addClass("select2-highlighted");
                };
                scope.mouseLeave = function(event){
                    var target = event.target ? angular.element(event.target) : angular.element(event.srcElement);
                    getParent(target).removeClass("select2-highlighted");
                };
                scope.$watch('source', createGroups);

                var disable = function(value){
                    scope.disabled = !!value;
                    if(scope.disabled){
                        scope.opened=false;
                    }
                };
                attrs.$observe('disabled', function(newVal){
                    disable(newVal);
                });
                scope.$watch('ngDisabled()',function(newValue, backValue){
                    if(newValue!==backValue){
                        if(newValue){
                            attrs.disabled='';
                        }else{
                            delete attrs.disabled;
                        }
                        disable(newValue);
                    }
                });
                scope.$watch('ngRequired()',function(newValue, backValue){
                    if(newValue!==backValue){
                        if(newValue){
                            attrs.required='';
                        }else{
                            delete attrs.required;
                        }
                    }
                });

                scope.getTemplatePath = function(){
                    return options.partPaths[options.groups ? options.groups.length : 0];
                };

                start();
            }
        }
    }]);