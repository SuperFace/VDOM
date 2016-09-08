define(function(require, exports, module){
	var binder = require("binder");
	var util = require("../../extends/util.js");
	
	var Ev = binder.Ev;
	var OB = binder.OB;
	
	var objCElement = document.getElementById("obj-c");
	console.log(objCElement instanceof Node);
    var objEv = Ev(objCElement);//包装DOM为可以绑定自定义事件的Ev对象（类似：jquery对象：$()）
    var obj = OB.init({});//对数据对象进行封装（添加观察模式）
    OB.bind(objEv, "keyup", obj, "objC-value", function(e){
    	return this.value;
    }, function(data){
    	this.value = data;
    });//双向绑定一个obj属性到一个html元素

    setTimeout(function(){
    	obj['objC-value'] = 30;		 
    }, 2000);
    setTimeout(function(){
    	obj['objC-value'] = 800
    }, 5000);
});