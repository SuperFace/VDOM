define(function(require, exports, module){
	var util = require("../../extends/util.js");
	/*
	 * DOM自定义及标准事件绑定
	 * */
	var Ev = function(element){
		return new Ev.fn.init(element);
	};
	
	// Ev 对象构建
	Ev.fn = Ev.prototype = {
		constructor: Ev,
		init: function(element){
			this.element = (element && element.nodeType == 1)? element: document;
		},
	
		/**
		 * 添加事件监听
		 * 
		 * @param {String} type 事件监听的类型，只在 mouseenter 和 mouseleave 两个事件时需要填写
		 *     方法内部需要对此作出处理以实现这两个虚拟事件的判断
		 * @param {Function} callback 回调函数
		 */
		add: function(type, callback){
			var _that = this;
			if(_that.element.addEventListener){
				/**
				 * @supported For Modern Browers and IE9+
				 */
				_that.element.addEventListener(type, function(e){
					(function(e){
						setTimeout(function(){
							callback.call(_that.element, e);
						}, 0);
					})(e);
				}, false);
			} else if(_that.element.attachEvent){
				/**
				 * @supported For IE5+
				 */
	            // 自定义事件处理
			    if( type.indexOf('custom') != -1 ){
	                if( isNaN( _that.element[type] ) ){
	                    _that.element[type] = 0;
	                } 
	                var fnEv = function(event){
	                	event = event ? event : window.event
	                    if( event.propertyName == type ){
	                    	(function(e){
	    						setTimeout(function(){
	    							callback.call(_that.element, e);
	    						}, 0);
	    					})(event);
	                    }
	                };
	                _that.element.attachEvent('onpropertychange', fnEv);
	                // 在元素上存储绑定的 propertychange 的回调，方便移除事件绑定
	                if( !_that.element['callback' + callback] ){
	                    _that.element['callback' + callback] = fnEv;
	                }
	            // 标准事件处理
	            } else {
		            _that.element.attachEvent('on' + type, function(e){
		            	(function(e){
    						setTimeout(function(){
    							callback.call(_that.element, e);
    						}, 0);
    					})(e);
		            });
	            }
			} else {
				/**
				 * @supported For Others
				 */
				_that.element['on' + type] = function(e){
					(function(e){
						setTimeout(function(){
							callback.call(_that.element, e);
						}, 0);
					})(e);
				};
			}
			return _that;
		},
		//双向绑定，触发UI自动更新####&&&&
		changeUIHandler: function(property, obj){
			var _that = this;
			_that.add("custom_"+property, function(e){
				obj["dataCallback"].call(_that.element, obj[property]);
				delete obj["dataCallback"];
			});
		},
	
		/**
		 * 移除事件监听
		 * 
		 * @param {String} type 事件监听的类型，只在 mouseenter 和 mouseleave 两个事件时需要填写
		 *     方法内部需要对此作出处理以实现这两个虚拟事件的判断
		 * @param {Function} callback 回调函数
		 */
		remove: function(type, callback){
			var _that = this;
			if(_that.element.removeEventListener){
				/**
				 * @supported For Modern Browers and IE9+
				 */
				_that.element.removeEventListener(type, callback, false);
			} else if(_that.element.detachEvent){
				/**
				 * @supported For IE5+
				 */
		      	// 自定义事件处理
				if( type.indexOf('custom') != -1 ){
					// 移除对相应的自定义属性的监听
					_that.element.detachEvent('onpropertychange', _that.element['callback' + callback]);
					// 删除储存在 DOM 上的自定义事件的回调
					_that.element['callback' + callback] = null;
				// 标准事件的处理
				} else {
					_that.element.detachEvent('on' + type, callback);
				}
			} else {
				/**
				 * @supported For Others
				 */
				_that.element['on' + type] = null;
			}
			return _that;
		},
	
		/**
		 * 模拟触发事件
		 * @param {String} type 模拟触发事件的事件类型
		 * @return {Object} 返回当前的 Kjs 对象
		 */
		trigger: function(type){
			var _that = this;
			try {
				if(_that.element.dispatchEvent){
					var evt = new CustomEvent(type, {
						  detail: {
							    hazcheeseburger: true
						  },
						  bubbles: true, 
						  cancelable: true
					});
					_that.element.dispatchEvent(evt);
				} else if(_that.element.fireEvent){//IE
		            if( type.indexOf('custom') != -1 ){//IE自定义事件
	                    _that.element[type]++;
	                } else {
				        _that.element.fireEvent('on' + type);//IE标准事件
	                }
	            }else{
	            	_that.element["on"+type]({
						  detail: {
							    hazcheeseburger: true
						  },
						  bubbles: true, 
						  cancelable: true
					});
	            }
	        } catch(e){
	        };
	        return _that;
		}
	}
	Ev.fn.init.prototype = Ev.fn;
	
	
	/*
	 * Observer，js对象观察者模式，
	 * 观察者的使用场合就是：当一个对象的改变需要同时改变其它对象，
	 *并且它不知道具体有多少对象需要改变的时候，就应该考虑使用观察者模式。
	 *通用代码：
	*/
	var Observer = {
	    //订阅
		addEvent: function (type, callback) {
	    	if(typeof type === "string" && typeof callback === "function"){
	    		if(typeof this.subscribers[type] === "undefined" ){
	    			this.subscribers[type] = [callback];
	    		}else{
	    			this.subscribers[type].push(callback);
	    		}
	    	}
	    	return this;
	    },
	    //退订
	    removeEvent: function (type, key) {
	    	var fnArr = this.subscribers[type];
	    	if(fnArr instanceof Array){
	    		if(typeof key === "function"){
	    			for(var i=0; i< fnArr.length; i++){
	    				if(fnArr[i] == key){
	    					fnArr.splice(i, 1);
	    					break;
	    				}
	    			}
	    		}else if(key instanceof Array){
	    			for (var lis=0, lenkey = key.length; lis<lenkey; lis+=1) {
	                    this.removeSubscriber(type, key[lenkey]);
	                }
	    		}else{
	    			delete this.subscribers[type];
	    		}
	    	}
	    	return this;
	    },
	    //发布
	    fireEvent: function (type, data) {
	    	if(type && this.subscribers[type]){
	    		var event = {
                    type: type,
                    target: this,
                    data: data
                };
                
                for (var length = this.subscribers[type].length, start=0; start<length; start+=1) {
                    this.subscribers[type][start].call(this, event);
                }
	    	}
	        return this;
	    },
	    // 将对象o具有观察者功能
	    make: function (o) { 
	        for (var i in this) {
	            o[i] = this[i];
	            o.subscribers = [];
	        }
	        return o;
	    }
	};
	
	
	var tempObj = {};
	
	var OB = {
			init: function(o){
				var _uuid = util.uuid();
				tempObj[_uuid] = {};
				for(var k in o){//遍历对象并生成包含对象属性对应的临时属性的数据对象tempObj[_uuid]
					tempObj[_uuid]["tem_"+ k] = o[k];
		    	}
				o["tempObj"] = _uuid;//将生成的临时属性数据对象key值存入原始对象中
				return Observer.make(o);//给对象填充观察者模式，并返回
			},
			bind: function(objEv, uitype, obj, property, uiCallback, dataCallback){
				obj.addEvent(property, function(e){//添加观察者事件
					tempObj[this["tempObj"]]["tem_"+ property] = e.data;//触发UI事件，储存UI中的值到临时数据对象（tempObj[_uuid]）中
				});
				objEv.add(uitype, function(e){//绑定UI原生事件
					var _uidata = uiCallback.call(this, e);
					obj.fireEvent(property, _uidata);//触发观察者
				});
				objEv.changeUIHandler(property, obj);//给DOM Ev对象添加绑定自定义事件
				Object.defineProperty(obj, property, {
				     set: function(x){
				    	 this["dataCallback"] = dataCallback;
				         tempObj[this["tempObj"]]["tem_"+ property] = x;
				         objEv.trigger("custom_"+property);//触发DOM Ev对象绑定的自定义事件
				     },
				     get: function(){
				         return tempObj[this["tempObj"]]["tem_"+ property];
				     },
				     enumerable: true,
				     configurable: true
				 });
			}
	}
	
	return {
		Ev: Ev,
		OB: OB
	}
});