app.controller('emailAdController', ['$scope', '$http', '$window', 'emailS', function($scope, $http, $window, emailS){

	if(emailS.getUserId() === undefined){
		$window.location.href = '/#/login';
	}

	$scope.send = function(){
		$http.post('/emailad/' +emailS.getUserId(), $scope.emailAd)
		.success(function(data){
			if(data.resStatus1){
				alert(data.resStatus1);
				emailS.setUserId(undefined);
				$window.location.href = '/#/';
			} else if(data.resStatus2){
				alert(data.resStatus2);
			} else{
				alert(data.resStatus);
				emailS.setUserId(undefined);
				$window.location.href = '/#/login';
			}
		})
		.error(function(err){
			return err;
		});
	};

	$scope.cancel = function(){
		emailS.setUserId(undefined);
		$window.location.href = '/#/addetail';
	};

}]);