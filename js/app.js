var app = angular.module("app", [
	"ngRoute",
	"customFilters", 
	"customDirectives"
]);

app.config(["$routeProvider", function($routeProvider){
	$routeProvider
	.when("/", {
		templateUrl: "partials/frontpage.html"
	})
	.when("/shop",{
		templateUrl: "partials/shop.html"	
	})
	.otherwise({
		redirectTo: "/"
	});
}]);

//Constants:
app.constant("baseUrl", "data/goods.json");
app.constant("activeClass", "active");

//Main controller:
app.controller("mainCtrl", ["$scope","$http","baseUrl", "activeClass", "$location", function($scope, $http, baseUrl, activeClass, $location){
	//get products from server:
	$scope.data = {};
	$http.get(baseUrl)
		.success(function(data){
			$scope.data.products = data;
		})
		.error(function(error){
			$scope.data.error
		});
	//manage categories:
	var selectItem = null;
	$scope.selectCategory = function(newItem){
		selectItem = newItem;
		$location.path("/shop");
	}
	// //apply 'active' class:
	// $scope.setClass = function(item){
	// 	return item == selectItem ? activeClass : "";
	// }
}]);



