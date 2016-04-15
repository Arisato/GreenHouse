app.controller('adDetailController', ['$scope', '$http', '$window', 'adDetailS', 'emailS', function($scope, $http, $window, adDetailS, emailS){
	
	if(adDetailS.getId() === undefined){
		$window.location.href = '/#/login';
	} else{
		$scope.hideIt = true;

		$http.get('/addetail/' +adDetailS.getId())
		.success(function(data){

			$http.get('/profile')
			.success(function(userData){
				$scope.dataResponse = userData;
				if(userData.resStatus1){
					$scope.hideIt = false;
				} else if(userData.user.id !== data.userId){
					$scope.hideIt = false;
				}
			})
			.error(function(err){
				$scope.hideIt = false;
				console.log(err);
			});


			$scope.listing = data;
			console.log($scope.listing);
		})
		.error(function(err){
			$window.location.href = '/#/';
			return err;
		});
	}

	$scope.sendEmail = function(user){
		emailS.setUserId(user);
		$window.location.href = '/#/emailad';
	};

	$scope.cancel = function(){
		adDetailS.setId(undefined);
		$window.location.href = '/#/login';
	};

}]);