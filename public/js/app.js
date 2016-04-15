var app = angular.module('app',['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise("/login");

	$stateProvider
	.state('home', {
		url: "/",
		views: {
			"listingView": { templateUrl: "views/listing.html",
								controller: "listingsController" },
			"loginView": { templateUrl: "views/login.html",
								controller: "loginController" }
		}
	})
	.state('login', {
		url: "/login",
		views: {
			"listingView": { templateUrl: "views/listing.html",
								controller: "listingsController" },
			"loginView": { templateUrl: "views/loggedin.html",
								controller: "loggedinController" }
		}
	})
	.state('logout', {
		url: "/logout",
		views: {
			"profileView": { templateUrl: "",
								controller: "logoutController" }
		}
	})
	.state('profile', {
		url: "/profile",
		views: {
			"profileView": { templateUrl: "views/profile.html",
								controller: "profileController" }
		}
	})
	.state('newad', {
		url: "/newad",
		views: {
			"profileView": { templateUrl: "views/profile.html",
								controller: "profileController" },
			"newAdView": { templateUrl: "views/postAd.html",
								controller: "newAdController" }
		}
	})
	.state('editad', {
		url: "/editad",
		views: {
			"editAdView": { templateUrl: "views/editAd.html",
								controller: "editAdController" }
		}
	})
	.state('myads', {
		url: "/myads",
		views: {
			"profileView": { templateUrl: "views/profile.html",
								controller: "profileController" },
			"myAdsView": { templateUrl: "views/myAds.html",
								controller: "myAdsController" }
		}
	})
	.state('myaddetail', {
		url: "/myaddetail",
		views: {
			"myAdDetailView": { templateUrl: "views/myAdDetails.html",
								controller: "myAdDetailsController" }
		}
	})
	.state('addetail', {
		url: "/addetail",
		views: {
			"adDetailView": { templateUrl: "views/adDetail.html",
								controller: "adDetailController" }
		}
	})
	.state('emailad', {
		url: "/emailad",
		views: {
			"emailAdView": { templateUrl: "views/emailAd.html",
								controller: "emailAdController" }
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