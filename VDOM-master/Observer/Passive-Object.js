//被动变动的对象

define(function(require, exports, module){
	var Tom = function(){
	    this.read = function (e) {
	        console.log('Tom看到了如下信息：' + e.data)
	    }
	};

	var MM = function(){
	    this.show = function (e) {
	        console.log('MM看到了如下信息：' + e.data)
	    }
	};
	return {
		Tom: Tom,
		MM: MM
	};
});
