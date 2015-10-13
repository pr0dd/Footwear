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
	//Define get function for 'price' filter:
	var getPrice = function(max){
		var prices = [];
		for(var i = 0; i < $scope.data.products.length; i++){
			var val = $scope.data.products[i].price;
			prices.push(val);
		}
		return angular.isDefined(max) ? Math.max.apply(null,prices) : Math.min.apply(null,prices);
	}

	//get products from server:
	$scope.data = {};
	$http.get(baseUrl)
		.success(function(data){
			$scope.data.products = data;
			//Define default variables which require $scope.data.products:
			$scope.data.min = getPrice(); //get dynamic min value for price filter's ng-model directive;
			$scope.data.max = getPrice(true); //get dynamic max value;
			$scope.min = getPrice(); //get static min value for range input;
			$scope.max = getPrice(true); //get static max value;
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
	$scope.minPriceFilterFn = function(item){
		return item.price >= Number($scope.data.min);
	}
	$scope.maxPriceFilterFn = function(item){
		return item.price <= Number($scope.data.max);
	}
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



