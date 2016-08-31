define(function(require, exports, module){
	var Observer = require("Observer");
	var DrivingObject = require("Driving-Object");
	var PassiveObject = require("Passive-Object");
	
	var Blogger = DrivingObject.Blogger;
	var User = DrivingObject.User;

	var Tom = PassiveObject.Tom;
	var MM = PassiveObject.MM;
	
	var blogger = new Blogger();
	var user = new User();
	
	var tom = new Tom();
	var mm = new MM();

	//将对象Blogger具有观察者功能
	Observer.make(blogger);

	//将对象User具有观察者功能
	Observer.make(user);

	setTimeout(function(){
		//订阅
		blogger.addEvent("recommend",tom.read).addEvent("recommend",mm.show);
		blogger.recommend(123); //调用发布	
	}, 2000);

	setTimeout(function(){
		//退订
		blogger.removeEvent("recommend", mm.show);
		blogger.recommend(456); //调用发布
	}, 5000);
	
	setTimeout(function(){
		//退订
		blogger.removeEvent("recommend");
		blogger.recommend(789); //调用发布
	}, 8000);

	setTimeout(function(){
		//另外一个对象的订阅
		user.addEvent("vote", mm.show);
		user.vote(789); //调用发布
	}, 10000);
});