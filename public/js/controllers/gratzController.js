app.controller('gratzController', ['$scope', 'gratzS', function($scope, gratzS){
	$scope.userName = gratzS.getName();
	console.log('this is from gratz ' +gratzS.getName());
}]);