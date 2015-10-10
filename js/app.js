var app = angular.module("app", [
	"ngRoute"
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
		templateUrl: "partials/frontpage.html"
	});
}]);

app.controller("mainCtrl", ["$scope", function($scope){

}]);
