app.controller('loggedinController', ['$scope', '$http', '$window', function($scope, $http, $window){
	$http.get('/profile')
	.success(function(data){
		console.log('loggedin (Controler) data received from the Server:');
		console.log(data)
		if(data.redirect === '/#/'){
			$window.location.href = data.redirect;
		} else{
			$scope.userEmail = data.user.email;
		}
	})
	.error(function(err){
		console.log(err);
		return err;
	});
}]);