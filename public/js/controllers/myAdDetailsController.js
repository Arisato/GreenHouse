app.controller('myAdDetailsController', ['$scope', '$http', '$window', 'myAdDetailS', function($scope, $http, $window, myAdDetailS){
	//$scope.ad = adDetailS.getId();
	if(myAdDetailS.getId() === undefined){
		$window.location.href = '/#/myads';
	} else{
		$http.get('/addetail/' +myAdDetailS.getId())
		.success(function(data){
			$scope.listing = data;
		})
		.error(function(err){
		return err;
		});
	}
}]);