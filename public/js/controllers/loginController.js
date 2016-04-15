app.controller('loginController', ['$scope', '$http', '$window', function($scope, $http, $window){
	$scope.login = function(){
		$http.post('/login', $scope.userLogin)
		.success(function(response, status){
			if(response.redirect === '/#/login'){
				$window.location.href = response.redirect;
				console.log('this is from loginController ');
			} else{
				$scope.response = response.error;
			};
		})
		.error(function(err){
			return err;
		});
	};
}]);