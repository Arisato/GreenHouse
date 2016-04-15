app.controller('myAdsController',['$scope', '$http', '$window', '$state', 'editAdS', 'myAdDetailS', function($scope, $http, $window, $state, editAdS, myAdDetailS){
	console.log("Hello from myads controller");

	$http.get('/myads')
	.success(function(data){
		$scope.hideIt = false;
		if(data.resStatus){
			$scope.hideIt = true;
			$scope.listings = data;
			console.log(data);
		} else{
			console.log('myads (Controller) data received from the Server:');
			console.log(data)
			$scope.listings = data;
		}
		
	})
	.error(function(err){
		console.log(err);
		return err;
	});

	$scope.deleteAd = function(adId){
		console.log(adId);

		$http.delete('/remove/' +adId)
		.success(function(data){
			$state.reload();
		})
		.error(function(err){
			return err;
		});
	};

	$scope.editAd = function(adId){
		editAdS.setId(adId);
		$window.location.href = '/#/editad';
	};

	$scope.myAdDetails = function(adId){
		myAdDetailS.setId(adId);
		$window.location.href = '/#/myaddetail';
	};
}]);