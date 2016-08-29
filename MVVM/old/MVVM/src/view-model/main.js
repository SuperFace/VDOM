define(function(require, exports, module){
	var binder = require("binder");
	var $ = binder.$;
	var Observer = binder.Observer;
	var definePropertyGetSet = binder.definePropertyGetSet;
	
	var el = require('../vdom/element')
	var diff = require('../vdom/diff')
	var patch = require('../vdom/patch')
  
var count = 0

  function renderTree () {
    count++

    var items = []
    var color = (count % 2 === 0)
      ? 'blue'
      : 'red';
    color = 'blue';

    for (var i = 0; i < count; i++) {
      items.push(el('li', ['Item #' + i]))
    }
    return el('div', {'id': 'container'}, [
      el('h1', {style: 'color: ' + color}, ['simple virtal dom']),
      el('p', ['the count is :' + count]),
      el('ul', items)
    ])
  }

  var tree = renderTree()
  var root = tree.render()
  document.body.appendChild(root)

  /*setInterval(function () {
    var newTree = renderTree()
    var patches = diff(tree, newTree)
    console.log(patches)
    patch(root, patches)

    tree = newTree
  }, 1000)*/
  
  //测试用例1（自定义事件测试）
  // 捕捉 DOM
  var testBox = document.getElementById('testBox');
	// 封装
  testBox = $(testBox);
  // 回调函数1
  function triggerEvent(e){
      console.log(e,'触发了一次自定义事件 customConsole');
      testBox.remove("customConsole", arguments.callee);//移除事件
  }
  // 回调函数2
  function triggerAgain(e){
  	console.log(e,'再一次触发了自定义事件 customConsole');
  	testBox.remove("customConsole", arguments.callee);//移除事件
  }
  
  // 同时绑定两个回调函数，支持链式调用
  testBox.add('customConsole', triggerEvent).add('customConsole', triggerAgain);

  // 测试用例2（标准事件测试）
  // 捕捉 DOM
  var testClick = document.getElementById('testClick');
	// 封装
  testClick = $(testClick);
  // 回调函数
  function triggerClick(e){
  	console.log(e, '擦，我被狠狠地点击了！');
      testBox.trigger('customConsole');
      testClick.remove("click",  arguments.callee);//移除事件
  }
  
  // 监听
  testClick.add('click', triggerClick);
  setInterval(function(){
  	testClick.trigger("click");//触发事件
  }, 2000);
  
  //Object.defineProperty
  var objCElement = document.getElementById("obj-c");
  var objEv = $(objCElement);
  objEv.add("customChange", function(e){
  	objCElement.innerHTML = obj.newAccessorProperty;
  	console.log("change value");
  });
  window.obj = {newAccessorProperty: 20};
  objCElement.innerHTML = obj.newAccessorProperty;
	 Object.defineProperty(obj, "newAccessorProperty", {
	     set: function (x) {
	         this.newaccpropvalue = x;
	         objEv.trigger("customChange");
	     },
	     get: function () {
	         return this.newaccpropvalue;
	     },
	     enumerable: true,
	     configurable: true
	 });
	
	 setTimeout(function(){
		 obj.newAccessorProperty = 30;		 
	 }, 2000);
});