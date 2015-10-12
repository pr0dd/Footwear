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
	$scope.productType = [];
	$scope.productBrand = [];
	$scope.typeVals = []; //ng-model values for type filter:
	$scope.brandVals = []; //ng-model values for brand filter:
		//Selecting functions:
	$scope.selectCategory = function(newItem){
		productCategory = newItem;
		$scope.refreshFilters();
		$location.path("/shop");
	}
	$scope.toggleFilter = function(newItem, source){
		if(source.indexOf(newItem)==-1) {
			source.push(newItem);
		} else {
			source.splice(source.indexOf(newItem),1);
		}
	}
		//Filtering functions:
	$scope.categoryFilterFn = function(item){
		return productCategory == null || item.category == productCategory;
	}
	$scope.typeFilterFn = function(item){
		return $scope.productType.length == 0 || $scope.productType.indexOf(item.type) != -1;
	}
	$scope.brandFilterFn = function(item){
		return $scope.productBrand.length == 0 || $scope.productBrand.indexOf(item.brand) != -1;
	}
		//Refresh filters:
	$scope.refreshFilters = function(){
		$scope.productType.length = 0;
		$scope.productBrand.length = 0;
		$scope.typeVals.length = 0;
		$scope.brandVals.length = 0;

	}

}]);



