app.controller('listingsController',['$scope', 'listingsS', function($scope, listingsS){
	console.log("Hello from listings controller");
	listingsS.success(function(data){
		$scope.listingsS = data;
	});
}]);