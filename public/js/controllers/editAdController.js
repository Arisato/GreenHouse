app.controller('editAdController', ['$scope', '$http', 'editAdS', '$window', function($scope, $http, editAdS, $window){
	if(editAdS.getId() === undefined){
		$window.location.href = '/#/myads';
	} else{
		$http.get('/getad/' +editAdS.getId())
		.success(function(data){
			if(data.redirect){
				$window.location.href = data.redirect;
			} else{
				$scope.ad = data;
			}
		})
		.error(function(err){
			return err;
		});
	}

	$scope.updateAd = function(){
		// console.log($scope.ad._id);
		// console.log($scope.ad.userId);
		$http.put('/update/' +$scope.ad._id, $scope.ad)
		.success(function(data){
			window.location.href = '/#/myads';
		})
		.error(function(err){
			return err;
		});
	};

	$scope.cancelUpdate = function(){
		editAdS.setId(undefined);
		window.location.href = '/#/myads';
	};
}]);