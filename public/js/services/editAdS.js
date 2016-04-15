app.service('editAdS', function(){
	var listingId;
	this.setId = function(id){
		listingId = id;
	};

	this.getId = function(){
		return listingId;
	};
});