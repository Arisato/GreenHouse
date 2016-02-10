var app = angular.module('app',['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise("/");

	$stateProvider
	.state('home', {
		url: "/",
		views: {
			"listingView": { templateUrl: "views/listing.html",
							  controller: "listingsController" },
			"loginView": { templateUrl: "views/login.html" }
		}
	})
	.state('login', {
		url: "/login",
		views: {
			"listingView": { templateUrl: "views/listing.html",
							  controller: "listingsController" },
			"loginView": { templateUrl: "views/loggedin.html" }
		}
	})
	.state('register', {
		url: "/register",
		views: {
			"registerView": { templateUrl: "views/register.html",
							   controller: "registerController" }
		}
	})
	.state('congratulations', {
		url: "/congratulations",
		views: {
			"gratzView": { templateUrl: "views/gratz.html",
							controller: "gratzController" }
		}
	});
}]);