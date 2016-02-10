app.service('gratzS', function(){
	var userName;
	this.setName = function(name){
		userName = name;
	};

	this.getName = function(){
		return userName;
	};
});