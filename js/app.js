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
	$scope.productSize = [];	
	$scope.productSeason = [];	
	$scope.typeVals = []; //ng-model values for type filter:
	$scope.brandVals = []; //ng-model values for brand filter:
	$scope.sizeVals = []; //ng-model values for size filter:
	$scope.seasonVals = []; //ng-model values for size filter:
	$scope.viewClass = "tile";

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

	//UTILITIES:
	var isInside = function(a, b){
		//check if any properties of array 'a' are inside of array 'b':
		if( angular.isArray(a) && angular.isArray(b) ){
			var result = false;
			for(var i = 0; i < a.length; i++){
				if( b.indexOf(a[i]) != -1 ){
					result = true;
				}
			}
		} else {
			throw new Error("One of the arguments is not an array");
		}
		return result;
	}
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
	$scope.setViewClass = function(value) {
		$scope.viewClass = value;
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
	$scope.sizeFilterFn = function(item){
		return $scope.productSize.length == 0 || isInside(item.size, $scope.productSize);
	}
	$scope.seasonFilterFn = function(item){
		return $scope.productSeason.length == 0 || $scope.productSeason.indexOf(item.season) != -1;
	}

		//Refresh filters:
	$scope.refreshFilters = function(){
		$scope.productType.length = 0;
		$scope.productBrand.length = 0;
		$scope.productSize.length = 0;
		$scope.productSeason.length = 0;

		$scope.typeVals.length = 0;
		$scope.brandVals.length = 0;
		$scope.sizeVals.length = 0;
		$scope.seasonVals.length = 0;
	}

}]);



