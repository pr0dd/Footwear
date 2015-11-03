var app = angular.module("app", [
	"ngRoute",
	"ngAnimate",
	"customFilters", 
	"customDirectives",
	"cart"
]);

app.config(["$routeProvider", function($routeProvider){
	$routeProvider
	.when("/", {
		templateUrl: "partials/frontpage.html"
	})
	.when("/shop",{
		templateUrl: "partials/shop.html"	
	})
	.when("/product/:id",{
		templateUrl: "partials/product.html",
		controller: "productCtrl"	
	})
	.when("/checkout",{
		templateUrl: "partials/checkout.html",
		controller: "checkoutCtrl"	
	})
	.when("/shipping",{
		templateUrl: "partials/shipping.html",
		controller: "shippingCtrl"	
	})
	.when("/thankyou",{
		templateUrl: "partials/thankYou.html",
		controller: "shippingCtrl"	
	})
	.otherwise({
		redirectTo: "/"
	});
}]);

//Constants:
app.constant("baseUrl", "data/goods.json");
app.constant("activeClass", "active");
app.constant("currentPageSize", 5);
app.constant("mainSlider", [
	{src: "main_slider_1.jpg", productId: "m01"},
	{src: "main_slider_2.jpg", productId: "m02"},
	{src: "main_slider_3.jpg", productId: "w03"},
	{src: "main_slider_4.jpg", productId: "k01"},
	{src: "main_slider_5.jpg", productId: "k03"}
]);
app.constant("brandsSlider", [
	{src: "br1.png"},
	{src: "br2.png"},
	{src: "br3.png"}
]);

//CONTROLLERS:
	//Main controller:
app.controller("mainCtrl", ["$scope","$http","baseUrl", "activeClass", "$location", "cart", "currentPageSize", "mainSlider", "brandsSlider", function($scope, $http, baseUrl, activeClass, $location, cart, currentPageSize, mainSlider, brandsSlider){
	
	//Define default variables:
	var productCategory = null;
	$scope.currentProduct = null;
	$scope.productType = [];
	$scope.productBrand = [];
	$scope.productSize = [];	
	$scope.productSeason = [];	
	$scope.typeVals = []; //ng-model values container for type filter:
	$scope.brandVals = []; //ng-model values container for brand filter:
	$scope.sizeVals = []; //ng-model values container for size filter:
	$scope.seasonVals = []; //ng-model values container for season filter:
	$scope.viewClass = "tile";
	$scope.pageSize = currentPageSize;
	$scope.selectedPage = 1;
	$scope.switchQuote = null;

	//Sliders:
	$scope.mainSlider = mainSlider;
	$scope.brandsSlider = brandsSlider;

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
		$scope.switchQuote = newItem;
		//Update values of 'price' filter and refresh other filters at each change of category;
		$scope.refreshFilters();
		initPrices();
		$location.path("/shop");
		$scope.$broadcast("newCategory");
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
	//Add to cart:
	$scope.addToCart = function(product){
        cart.addProduct(product.id, product.name, product.price);
        if($scope.modalShown) {
			$scope.modalShown = false;
			$scope.modalProduct = null;
		}
    }
	//Move to product details:
	$scope.viewDetails = function(item){
		if($scope.modalShown) {
			$scope.modalShown = false;
			$scope.modalProduct = null;
		}
		$scope.currentProduct = item;
		$location.path("/product/" + item.id);
	}
	//Pagination:
	$scope.setPage = function(page){
    $scope.selectedPage = page;
  }
	$scope.getPageClass = function(page) {
		return $scope.selectedPage == page ? activeClass: "";
	}
	//Navigation:
	$scope.showCats = false;
	$scope.showCart = false;
	$scope.toggleShow = function(a){
		$scope[a] = !$scope[a];
	}
	$scope.goTo = function(a){
		$location.path("/"+a);
	}
	
	//Deal with modals:
	$scope.modalShown = false;
	$scope.modalProduct = null;
	$scope.$on("showModal", function(event, product){
		$scope.modalProduct = product;
		$scope.modalShown = true;
	});
	$scope.$on("closeModal", function(){
		$scope.modalProduct = null;
		$scope.modalShown = false;
	});
}]);

	//Product controller:

app.controller("productCtrl", ["$scope", "$routeParams", function($scope, $routeParams){
	var id = $routeParams['id'];
	var getProduct = function(id){
		var result;
		for(var i = 0; i<$scope.data.products.length; i++){
			if($scope.data.products[i].id == id){
				result = $scope.data.products[i];
			}
		}
		return result;
	}

	$scope.product = getProduct(id);
}]);

	//Checkout cart controller:
	
app.controller("checkoutCtrl", ["$scope", "cart", function($scope, cart){
	$scope.cartData = cart.getProducts();
	$scope.total = function(){
		var result = 0;
		for(var i = 0; i < $scope.cartData.length; i++){
			result += ($scope.cartData[i].count*$scope.cartData[i].price);
		}
		return result;
	};
	$scope.remove = function(product) {
		cart.removeProduct(product.id);
	}

}]);

	//Shipping form controller:

app.controller("shippingCtrl", ["$scope", "cart", "$location", function($scope, cart, $location){
	$scope.cartData = cart.getProducts();
	$scope.data.shipping = {};//review;
	$scope.sendOrder = function(){
		$location.path("/thankyou");
	}

}]);



