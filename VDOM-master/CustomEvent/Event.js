/** 
 *跨所有浏览器的event事件工具类 
 */  
var EventUtil={  
    //增加事件  
    /** 
     * element 要操作的元素，事件名称，事件处理程序函数 
     */  
    addHandler:function(element,type,handler){  
        if(element.addEventListener){//DOM2  
            element.addEventListener(type,handler,false);  
        }else if(element.attachEvent){//IE  
            element.attachEvent("on"+type,handler);  
        }else{//DOM0  
            element["on"+type] = handler;  
        }  
    },  
    /** 
     * element 要操作的元素，事件名称，事件处理程序函数 
     */  
    removeHandler:function(element,type,handler){  
        if(element.removeEventListener){//DOM2  
            element.removeEventListener(type,handler,false);  
        }else if(element.detachEvent){//IE  
            element.detachEvent("on"+type,handler);  
        }else{//DOM0  
            element["on"+type] = null;  
        }  
    },  
    /** 
     *  获得event对象 window.event(IE) 
     */  
    getEvent:function(event){  
        return event?event:window.event;  
    },  
    /** 
     * 获得目标对象 srcElement(IE) 
     */  
    getTarget:function(event){  
        return event.target||event.srcElement;  
    },  
    /** 
     * 阻止特定事件的默认行为，例如阻止超链接的默认行为 
     */  
    preventDefault:function(event){  
        if(event.preventDefault){//DOM事件  
            event.preventDefault();  
        }else{//IE  
            event.returnValue=false;  
        }  
    },  
    /** 
     * 停止进一步的事件捕获或者冒泡 
     */  
    stopPropagation:function(){  
        if(event.stopPropagation){//DOM事件  
            event.stopPropagation();  
        }else{//IE  
            event.cancelBubble == true;  
        }  
          
    },  
    /** 
     *mouseover,mouseout  失去光标元素和获得光标元素 
     * @param event 
     * @returns 
     */  
    getRelatedTarget:function(event){  
        if(event.relatedTarget){//DOM  
            return event.relatedTarget;  
        }else if(event.toElement){//IE mouseover  
            return event.toElement;  
        }else if(event.fromElement){//IE mouseout  
            return event.fromElement;  
        }else{  
            return null;  
        }  
    },  
    /** 
     * DOM中 0==鼠标左键 1==鼠标中间的滑轮 2==鼠标右键 
     * IE中要对8中按钮属性值进行规范处理 
     * @param event 
     * @returns 
     */  
    getButton:function(event){  
        if(document.implementation.hasFeature("MouseEvents", "2.0")){//DOM  
            return event.button;  
        }else{//IE  
            switch(event.button){  
                case 0:  
                case 1:  
                case 3:  
                case 5:  
                case 7:  
                    return 0;  
                case 2:  
                case 6:  
                    return 2;  
                case 4:  
                    return 1;  
            }  
        }  
    },  
    /** 
     * 获得键盘的ASCII码，可通过String.fromCharCode();转换成实际的字符 
     */  
    getCharCode:function(event){  
        if(typeof event.charCode ==  "number"){//FF ,Chrome,safari  
            return event.charCode;  
        }else{//IE Opera  
            return event.keyCode;  
        }  
    },  
    /*** 
     * 获得鼠标滚轮的增量值 默认120 
     */  
    getWheelDeta:function(event){  
        if(event.wheelDelta){  
            return (client.engine.opera&&client.engine.opera<9.5?-event.wheelDelta:event.wheelDelta);  
        }else{//FF  
            return -event.detail*40;  
        }  
    },  
    /** 
     * element仅限于哪些可以用鼠标选择文本的 textarea ,input之类的控件.获得选择的文本内容 
     * @param element 
     */  
    getSelectedText:function(element){  
        if(document.selection){//IE  
            return document.selection.createRange().text;  
        }else{  
            return element.value.substring(element.selectionStart,element.selectionEnd);  
        }  
    },  
    /** 
     * 设置选择文本 
     * @param textbox 
     * @param startIndex 
     * @param stopIndex 
     */  
    setSelectText:function(textbox,startIndex,stopIndex){  
        if(textbox.setSelectionRange){  
            textbox.setSelectionRange(startIndex,stopIndex);  
        }else if(textbox.createTextRange){  
            var range=textbox.createTextRange();  
            range.collapse();  
            range.moveStart("character",startIndex);  
            range.moveEnd("character",stopIndex-startIndex);  
            range.select();  
        }  
        textbox.focus();  
    },  
    /** 
     * 屏蔽键盘上输入非数值字符 firefox 非字符键触发的keypress时间对于字符编码0，ksafari3，则对于8 
     * @param event 
     */  
    preventNotNumber:function(event){  
        event=this.getEvent(event);  
        var target=this.getTarget(event);  
        var charCode=this.getCharCode(event);  
        if(!/\d/.test(String.fromCharCode(charCode))&&charCode>9&&!event.ctrlKey){  
            this.preventDefault(event);  
        }  
          
    },  
    /** 
     * 获得粘贴板内容  
     * @param event 
     * @returns 
     */  
    getClipboardText:function(event){  
        var clipboardData=(event.clipboardData || window.clipboardData);  
        return clipboardData.getData("text");  
    },  
    /** 
     * 设置粘贴板内容 
     * @param event 
     * @returns 
     */  
    setClipboardText:function(event){  
        if(event.clipboardData){//safari,chrome  
            return event.clipboardData.setData("text/plain",value);  
        }else if(window.clipboardData){//IE  
            return window.clipboardData.setData("text");  
        }  
    },  
    /** 
     * 自动切换焦点,<input type="text" id="textTel1" maxlength="3"/> 
     * EventUtil.addHandler("textbox1","keyup",tabForward) 
     */  
    tabForward:function(event){  
        event=this.getEvent(event);  
        var target=this.getTarget(event);  
        if(target.value.length == target.maxLength){  
            var form = target.form;  
            for(var i=0,len=form.elements.length;i<len;i++){  
                if(form.elements[i]==target){  
                    form.elements[i+1].foucs();  
                    return;  
                }  
            }  
        }  
    },  
    /** 
     * 序列化form表单 
     */  
    serializeForm:function(form){  
        var parts=new Array();  
        var field=null;  
        for(var i=0,len=form.elements.length;i<len;i++){  
            field=form.elements[i];  
            switch(field.type){  
            case "select-one":  
            case "select-multiple":  
               for(var j=0,oplen=field.options.length;j<oplen;j++){  
                   var option=field.options[j];  
                   if(option.selected){  
                       var optValue="";  
                       if(option.hasAttribute){  
                           optValue=option.hasAttribute("value")?option.value:option.text;  
                       }else{  
                           optValue=option.attributes["value"].specified?option.value:option.text;  
                       }  
                       parts.push(encodeURIComponent(field.name)+"="+encodeURIComponent(optValue));  
                   }  
               }  
              break;  
                
            case undefined:  
            case "file":  
            case "submit":  
            case "reset":  
            case "button":  
                break;  
            case "radio":  
            case "checkbox":  
                if(!field.checked){  
                    break;  
                }  
            default:  
                parts.push(encodeURIComponent(field.name)+"="+encodeURIComponent(field.value));  
            }  
        }  
        return parts.join("&");  
    },  
    contains:function(refNode,otherNode){  
           if(typeof refNode.contains == "function" && (!client.engine.webkit||client.engine.webkit>=522)){  
               return refNode.contains(otherNode);  
           }else if(typeof refNode.compareDocumentPostion=="function"){  
               return !!(refNode.compareDocumentPostion(otherNode)&16);  
           }else{  
               var node=otherNode.parentNode;  
               do{  
                   if(node==refNode){  
                       return true;  
                   }else{  
                       node=node.parentNode;  
                   }  
               }while(node!==null)  
               return false;  
           }  
       }  
         
      
} 