app.controller('registerController', ['$scope', '$http', '$window', 'gratzS', function($scope, $http, $window, gratzS){
	$scope.register = function(){
		$http.post('/register',  $scope.user)
		.success(function(response, status){
			if(response.redirect === '/#/congratulations'){
				gratzS.setName(response.firstName);
				$window.location.href = response.redirect;
				console.log('this is from register ' +gratzS.getName());
			}
			else{
				$scope.response = response.error;
			};
		})
		.error(function(err){
			return err;
		});
	};
}]);