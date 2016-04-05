app.controller('loginController', ['$scope', '$http', '$window', 'loginS', function($scope, $http, $window, loginS){
	$scope.login = function(){
		$http.post('/login', $scope.userLogin)
		.success(function(response, status){
			if(response.redirect === '/#/login'){
				loginS.setEmail(response.email);
				$window.location.href = response.redirect;
				console.log('this is from loginController ' +loginS.getEmail());
			} else{
				$scope.response = response.error;
			};
		})
		.error(function(err){
			return err;
		});
	};
}]);