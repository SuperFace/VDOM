define(function(require, exports, module){
	var _ = {};

	_.type = function (obj) {
	  return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '')
	}

	_.isArray = function isArray (list) {
	  return _.type(list) === 'Array'
	}

	_.slice = function slice (arrayLike, index) {
	  return Array.prototype.slice.call(arrayLike, index)
	}

	_.truthy = function truthy (value) {
	  return !!value
	}

	_.isString = function isString (list) {
	  return _.type(list) === 'String'
	}

	_.each = function each (elements, callback) {
		if(isArray(elements)){
			elements.forEach(function(value, index, arr){ callback.call(value, value, index, arr) })
		}else{
			var i, key;
			if (likeArray(elements)) {
			  for (i = 0; i < elements.length; i++)
				if (callback.call(elements[i], elements[i], i) === false) return elements
			} else {
			  for (key in elements)
				if (callback.call(elements[key], elements[key], key) === false) return elements
			}
		}
		return elements
	}

	_.toArray = function toArray (listLike) {
	  if (!listLike) {
	    return []
	  }
	  var list = []
	  if(_.type(Array.from) == "Function"){
		  list = Array.from(listLike);
	  }else{
		  for (var i = 0, len = listLike.length; i < len; i++) {
		    list.push(listLike[i])
		  }
	  }
	  return list
	}

	_.setAttr = function setAttr (node, key, value) {
	  switch (key) {
	    case 'style':
	      node.style.cssText = value
	      break
	    case 'value':
	      var tagName = node.tagName || ''
	      tagName = tagName.toLowerCase()
	      if (tagName === 'input' || tagName === 'textarea') {
	        node.value = value
	      } else {
	        // if it is not a input or textarea, use `setAttribute` to set
	        node.setAttribute(key, value)
	      }
	      break
	    default:
	      node.setAttribute(key, value)
	      break
	  }
	}
	_.uuid = function(){
		return 'xxxxxyxxxxxyxx4xxxyxxxxxyxxxxxyxxxxx'.replace(/[xy]/g, function(c) {
	        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	        return v.toString(16);
	    });
	}
	//返回指定范围的随机数：[lowerValue, upperValue]
	_.getRandom = function(lowerValue, upperValue){
		var choics = upperValue - lowerValue + 1;
		return (Math.random() * choics + lowerValue)|0;
	}
	/*******三种克隆js对象的方式******/
	_.clone1 = function(obj){
		var o;  
	    switch(typeof obj){  
	    case 'undefined': break;  
	    case 'string'   : o = obj + '';break;  
	    case 'number'   : o = obj - 0;break;  
	    case 'boolean'  : o = obj;break;  
	    case 'object'   :  
	        if(obj === null){  
	            o = null;  
	        }else{  
	            if(obj instanceof Array){  
	                o = [];  
	                for(var i = 0, len = obj.length; i < len; i++){  
	                    o.push(clone(obj[i]));  
	                }  
	            }else{  
	                o = {};  
	                for(var k in obj){  
	                    o[k] = clone(obj[k]);  
	                }  
	            }  
	        }  
	        break;  
	    default:          
	        o = obj;break;  
	    }  
	    return o;     
	}
	_.clone2 = function(obj){
		var o, obj;  
	    if (obj.constructor == Object){  
	        o = new obj.constructor();   
	    }else{  
	        o = new obj.constructor(obj.valueOf());   
	    }  
	    for(var key in obj){  
	        if ( o[key] != obj[key] ){   
	            if ( typeof(obj[key]) == 'object' ){   
	                o[key] = clone2(obj[key]);  
	            }else{  
	                o[key] = obj[key];  
	            }  
	        }  
	    }  
	    o.toString = obj.toString;  
	    o.valueOf = obj.valueOf;  
	    return o;  
	}
	_.clone3 = function(obj){
		function Clone(){};
		Clone.prototype = obj;
		var o = new Clone();
		for(var key in o){
			if(typeof o[key] == "object"){
				o[key] = Clone3(o[key]);
			}
		}
		return o;
	}
	_.ajax = function(url,fn,posto){
		var xhr = new XMLHttpRequest();  
		if (url.length==0){ 
		  return;
		}
		xhr.onload = function(){ 
			var r = null;
			if (xhr.readyState==4 && xhr.status==200 ){
				var r=xhr.responseText;	
				if(r && typeof r =='string'){
					r=eval('('+r+')');
				}
			}
			if(fn && typeof fn == "function"){
				fn(r);  
			}
		};  
		if(posto){
			var postStr='';
			for(var key in posto){
				postStr+=key+'='+posto[key]+'&';
			}
			postStr=postStr.slice(0,postStr.length-1);
			xhr.open("POST",url,true);
			xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xhr.send(postStr);
		}else{
			xhr.open("GET",url,true);
			xhr.send(); 
		}
		return xhr;
	} //--ajax--end
	_.loadImage = function(path, callback) {
	    var img = new Image();
	    img.src = path;
	    img.onload = function() {
	        img.onload = null;
	        if(typeof callback == "function"){
	        	callback(path);
	        }
	    };
	}
	
	return _;
});