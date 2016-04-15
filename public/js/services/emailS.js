app.service('emailS', function(){
	var userId;
	this.setUserId = function(id){
		userId = id;
	};

	this.getUserId = function(){
		return userId;
	};
});