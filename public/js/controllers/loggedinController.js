app.controller('loggedinController', ['$scope', 'loginS', function($scope, loginS){
	$scope.userEmail = loginS.getEmail();
	console.log('this is from loggedinController ' +loginS.getEmail());
}]);