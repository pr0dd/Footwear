angular.module("cart",[])
	.factory("cart", function(){
		var cartData = [];

		return {
			addProduct: function(id,name,price,size,color) {
				var addedToExistingItem = false;
				for(var i = 0; i < cartData.length; i++){
					if(cartData[i].id == id) {
						cartData[i].count++;
						addedToExistingItem = true;
						break;
					}
				}
				if(!addedToExistingItem){
					cartData.push({
						count: 1,
						id: id,
						name: name,
						price: price,
						sizes: size,
						selectedSize: null,
						colors: color,
						selectedColor: null
					});
				}
			},
			removeProduct: function(id) {
				for(var i = 0; i < cartData.length; i++) {
					if(cartData[i].id == id) {
						cartData.splice(i,1);
						break;
					}
				}
			},
			getProducts: function() {
				return cartData;
			}

		}
	})
	.directive("cartSummary", ["cart", "$location", function(cart, $location){
		return {
			restrict: "EA",
			templateUrl:"partials/cartSummary.html",
			controller: function($scope){
				var cartData = cart.getProducts();
				$scope.itemCount = function(){
					var result = 0;
					for(var i = 0; i < cartData.length; i++){
						result += cartData[i].count;
					}
					return result;
				}
				$scope.total = function(){
					var result = 0;
					for(var i = 0; i < cartData.length; i++){
						result += (cartData[i].count*cartData[i].price);
					}
					return result;
				}
				$scope.checkout = function(){
					$location.path("/checkout");
				}
			}
		}
	}]);