//主动发生自身变化的对象

define(function(require, exports, module){
	var Blogger = function(){
	    this.recommend = function (id) {
	        var msg = 'dudu 推荐了的帖子:' + id;
	        var that = this;
	        (function(msg){
	        	setTimeout(function(){
	        		that.fireEvent("recommend", msg);
	        	}, 0);
	        })(msg);
	        
	    }
	};

	var User = function(){
	    this.vote = function (id) {
	        var msg = '有人投票了!ID=' + id;
	        var that = this;
	        (function(msg){
	        	setTimeout(function(){
	        		that.fireEvent("vote", msg);
	        	}, 0);
	        })(msg);
	    }
	};
	return {
		Blogger: Blogger,
		User: User
	};
});
