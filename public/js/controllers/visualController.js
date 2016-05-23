var app = angular.module('App',['nvd3']);

app.controller('visualController', ['$scope','$http', function($scope, $http){
	$scope.options = {
		chart: {
			type: 'lineChart',
			height: 500,
			margin: {
				top: 10,
				right: 200,
				left: 200,
				bottom: 50
			},
			useInteractiveGuideline: true,
			isArea: false,
			x: function(d){ 
				var res = new Date(d.date);
				console.log(d);
				return d.date; },
			y: function(d){ return d.count; },
			xAxis: {
				axisLabel: 'Date created',
				tickFormat: function(d){
					return new Date(d).toString();
				}
			},
			yAxis: {
				axisLabel: 'Number of ads',
				tickFormat: function(d){ return d; }
			}
		}
	}

	$scope.data = []


	$http.get('/listings')
	.success(function(data){
		console.log('Listings (Controller) data received from the Server:');
		console.log(data)
		var dict = {};
		data.map(function(listing){
			var _d = listing.dateAdded.split('-')[0].split("/").reverse().join("/").replace('/','-').replace('/','-');
			var key = Date.parse(_d);
			
			if( dict[key] == undefined ){
				dict[key] = 1
			}else{
				dict[key] = dict[key] + 1
			}
		})

		var _data = []
		console.log(dict)
		for( var prop in dict ){
			if(dict.hasOwnProperty(prop)){
				_data.push({ 'date':prop, 'count':dict[prop] })
			}else console.error("Wrong!")
		}		
		_data.sort(function(a,b){ return a.date - b.date })
		console.log(_data)
		$scope.data = [{
			key: "Chart of Ads over time",
			values: _data
		}];
		
	})
	.error(function(err){
		console.log(err);
		return err;
	});
}]);