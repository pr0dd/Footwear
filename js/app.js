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
	//Define default variables:
	var productCategory = null;
	$scope.productType = [];
	$scope.productBrand = [];
	$scope.typeVals = []; //ng-model values for type filter:
	$scope.brandVals = []; //ng-model values for brand filter:

	//Initialization function for 'price' filter:
	var initPrices = function(){
		//Define get function:
		var getPrice = function(max){
			var prices = [];
			var data = $scope.data.products;
			if(productCategory==null){
				for(var i = 0; i < data.length; i++){
					var val = data[i].price;
					prices.push(val);
				}
			} else {
				for(var i = 0; i < data.length; i++){
					if(data[i].category == productCategory) {
						var val = data[i].price;
						prices.push(val);
					}
				}
			}
			return angular.isDefined(max) ? Math.max.apply(null,prices) : Math.min.apply(null,prices);
		}
		//Get dynamic min/max values for 'price' filter's ng-model directive:
		$scope.data.min = getPrice(); 
		$scope.data.max = getPrice(true);
		//Get static min/max values for range input:
		$scope.min = getPrice(); 
		$scope.max = getPrice(true); 
	}
	//Get products from server:
	$scope.data = {};
	$http.get(baseUrl)
		.success(function(data){
			$scope.data.products = data;
			//Define defaults for 'price' filter:
			initPrices();
		})
		.error(function(error){
			$scope.data.error
		});

	//FILTERS:
		//Selecting functions:
	$scope.selectCategory = function(newItem){
		productCategory = newItem;
		$scope.refreshFilters();
		//Update values of 'price' filter at each change of category;
		initPrices();
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



