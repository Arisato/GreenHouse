app.controller('listingsController',['$scope', '$http', '$window', 'adDetailS', function($scope, $http, $window, adDetailS){
	console.log("Hello from listings controller");

	$http.get('/listings')
	.success(function(data){
		console.log('Listings (Controller) data received from the Server:');
		console.log(data)
		if(data.resStatus){
				$scope.listings = undefined;
				$scope.response = data.resStatus;
			} else{
				$scope.response = undefined;
				$scope.listings = data;
			}
	})
	.error(function(err){
		console.log(err);
		return err;
	});

	$scope.searchAd = function(){
			console.log($scope.search);
			$http.get('/search/' +$scope.search)
			.success(function(data){
				if(data.resStatus){
					$scope.listings = undefined;
					$scope.response = data.resStatus;
				} else{
					$scope.response = undefined;
					$scope.listings = data;
				}
			})
			.error(function(err){
				return err;
			});
	};

	$scope.adDetails = function(adId){
		adDetailS.setId(adId);
		$window.location.href = '/#/addetail';
	};
}]);