//漫谈JS自定义事件：http://www.zhangxinxu.com/wordpress/2012/04/js-dom%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BA%8B%E4%BB%B6/
//https://developer.mozilla.org/en-US/docs/Web/API/Event
//MDN: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy 用来替换下面的：Object.observer();
//(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe)
//https://developer.mozilla.org/en-US/docs/Web/API
//这里给出一个完整的DOM事件机制，这个机制支持标准事件和自定义事件的监听，移除监听和模拟触发操作。
//需要注意的是，为了使到代码的逻辑更加清晰，这里约定自定义事件带有 'custom' 的前缀（例如：customTest，customAlert）。
//addEventListener removeEventListener; attachEvent detachEvent; dispatchEvent fireEvent; onpropertychange (event.properName == type)
(function(window){
	var Ev = window.Ev = window.$ = function(element){
		return new Ev.fn.init(element);
	};
	
	// Ev 对象构建
	Ev.fn = Ev.prototype = {
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
				_that.element.addEventListener(type, callback, false);
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
	                        callback.call(_that.element, event);
	                    }
	                };
	                _that.element.attachEvent('onpropertychange', fnEv);
	                // 在元素上存储绑定的 propertychange 的回调，方便移除事件绑定
	                if( !_that.element['callback' + callback] ){
	                    _that.element['callback' + callback] = fnEv;
	                }
	            // 标准事件处理
	            } else {
		            _that.element.attachEvent('on' + type, callback);
	            }
			} else {
				/**
				 * @supported For Others
				 */
				_that.element['on' + type] = callback;
			}
			return _that;
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
})(window);