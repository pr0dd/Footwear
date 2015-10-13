angular.module("customDirectives", [])

.directive("setActive", function(){
	return function(scope, element, attrs){
		var makeActive = function(){
			element.parent().children().removeClass("active");
			element.addClass("active");
		}
		element.on("click", makeActive);
	}
})
.directive("numberOnly", function(){
	return function (scope, element, attrs) {
            var watchMe = attrs["ngModel"];
            scope.$watch(watchMe, function(newValue,oldValue) {
              if(newValue == undefined || newValue == null || newValue == ""){
                return;
              } else if (isNaN(newValue)) {
                var myVal = watchMe.split(".");
                switch (myVal.length) {
                  case 1:
                    scope[myVal[0]] = oldValue;
                    break;
                  case 2:
                    scope[myVal[0]][myVal[1]] = oldValue;
                    break;
                }
              }
            });
          }
})
//There's a known bug in Angular related to <input type=range min="" max=""> element: 
//no matter what value you set to ng-model for this element, 
//the element's slider will remain at its innitial (min) position when the page is first loaded.
//For example it wasn't possible to set the innitial slider's position to its end (max) by setting ng-model to max value.
//The solution was reached by making element's min and max attributes dinamic, 
//i.e by using the following directives for their values:
.directive('ngMin', function() {
  return {
    restrict : 'A',
    require : ['ngModel'],
    compile: function($element, $attr) {
      return function (scope, element, attrs, controllers) {
        var ngModelController = controllers[0];
        scope.$watch($attr.ngMin, function watchNgMin(value) {
          element.attr('min', value);
          ngModelController.$render();
        })
      }
    }
  }
})
.directive('ngMax', function() {
  return {
    restrict : 'A',
    require : ['ngModel'],
    compile: function($element, $attr) {
      return function (scope, element, attrs, controllers) {
        var ngModelController = controllers[0];
        scope.$watch($attr.ngMax, function watchNgMax(value) {
          element.attr('max', value);
          ngModelController.$render();
        })
      }
    }
  }
});