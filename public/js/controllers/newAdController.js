app.controller('newAdController', ['$scope', '$http', '$window', function($scope, $http, $window){
	$scope.postAd = function(){

		var date = new Date(); 
		var dateAndTime =
				  ("0"+ date.getDate()).slice(-2) + "/"
                + ("0"+ (date.getMonth()+1)).slice(-2)  + "/" 
                + date.getFullYear() + "-"  
                + ("0"+ date.getHours()).slice(-2) + ":"  
                + ("0"+ date.getMinutes()).slice(-2) + ":" 
                + ("0"+ date.getSeconds()).slice(-2);

		$scope.ad.dateAdded = dateAndTime;
		$http.post('/newad', $scope.ad)
		.success(function(response, status){
			if(response.redirect === '/#/'){
				$window.location.href = response.redirect;
			} else{
				$window.location.href = '/#/profile';
			}
		})
	};
}]);