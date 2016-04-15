app.controller('profileController', ['$scope', '$http', '$window', function($scope, $http, $window){
	$http.get('/profile')
	.success(function(data){
		console.log('Profile (Controler) data received from the Server:');
		console.log(data)
		if(data.redirect === '/#/'){
			$window.location.href = data.redirect;
		} else{
			$scope.userData = data.user;
		}
	})
	.error(function(err){
		console.log(err);
		return err;
	});

	$scope.postAd = function(){
		window.location.href = '/#/newad';
	};

	$scope.myAds = function(){
		window.location.href = '/#/myads';
	};

	$scope.listings = function(){
		window.location.href = '/#/login';
	};
}]);