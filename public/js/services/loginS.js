app.service('loginS', function(){
	var userEmail;
	this.setEmail = function(email){
		userEmail = email;
	};

	this.getEmail = function(){
		return userEmail;
	};
});