app.controller('gratzController', ['$scope', 'gratzS', '$window', function($scope, gratzS, $window){
	if(gratzS.getName() === undefined){
		$window.location.href = '/#/login';
	} else{
		$scope.userName = gratzS.getName();
		console.log('this is from gratz ' +gratzS.getName());
	}

	$scope.goBack = function(){
		gratzS.setName(undefined);
		$window.location.href = '/#/login';
	};
}]);