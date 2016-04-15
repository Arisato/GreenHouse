app.controller('logoutController', ['$http', '$window', 'editAdS', 'adDetailS', 'myAdDetailS', function($http, $window, editAdS, adDetailS, myAdDetailS){
	console.log('Logout controller reached');
	$http.get('/logout')
	.success(function(data){
		console.log('Logout response: ' +data.response);
	})
	.error(function(err){
		return err;
	});
	editAdS.setId(undefined);
	adDetailS.setId(undefined);
	myAdDetailS.setId(undefined);
	$window.location.href = '/#/';
}]);