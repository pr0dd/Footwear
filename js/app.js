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
		
	//FILTERS:
		//Define default variables:
	var productCategory = null;
	var productType = [];
		//Selecting functions:
	$scope.selectCategory = function(newItem){
		productCategory = newItem;
		$location.path("/shop");
	}
	$scope.toggleTypeSelect = function(newItem){
		if(productType.indexOf(newItem)==-1) {
			productType.push(newItem);
		} else {
			productType.splice(productType.indexOf(newItem),1);
		}
	}
		//Filtering functions:
	$scope.categoryFilterFn = function(item){
		return productCategory == null || item.category == productCategory;
	}
	$scope.typeFilterFn = function(item){
		var selector = false;
		for(var i=0; i<productType.length; i++){
			if(productType[i] == item.type) {selector = true;}
		}
		return productType.length == 0 || selector == true;
	}

}]);



