app.factory('listingsS',['$http',function($http){
	return $http.get('/listings')
			.success(function(data){
				console.log('Data received from the Server:');
				console.log(data)
				return data;
			})
			.error(function(err){
				console.log(err);
				return err;
			});
}]);