/*
 * 观察者的使用场合就是：当一个对象的改变需要同时改变其它对象，
并且它不知道具体有多少对象需要改变的时候，就应该考虑使用观察者模式。
*/

//通用代码
define(function(require, exports, module){
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
	    fireEvent: function (type, msg) {
	    	if(type && this.subscribers[type]){
	    		var event = {
                    type: type,
                    target: this,
                    data: msg
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
	    }
	};
	return Observer;
});
