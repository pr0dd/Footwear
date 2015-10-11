angular.module("customDirectives", [])

.directive("setActive", function(){
	return function(scope, element, attrs){
		var makeActive = function(){
			element.parent().children().removeClass("active");
			element.addClass("active");
		}
		element.on("click", makeActive);
	}
});