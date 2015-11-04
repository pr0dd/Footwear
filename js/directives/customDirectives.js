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
              scope.setPage(1);
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
})
      ///////////
      //SLIDER://
      ///////////
.directive("slider", function($interval, $timeout, $route, $window, $location){
  return {
    restrict: "A",
    templateUrl: "partials/slider.html", 
    scope: {
      source: "=", 
      duration: "@", 
      showdots: "@", 
      separator: "@", 
      filterBy: "@", 
      multiple: "@"
    }, 
    link: function(scope, element, attrs){
      
      //Create a local copy of the images source:
      scope.images = scope.source.slice(0);
      
      //Use this function to filter source array if scope.filterBy is defined:
      var filter = function(array, property, separator){
        array.sort(function(a, b){
          return a[property] - b[property];
        });
        var chosen = array.slice(0, separator*3);
        return chosen;
      }

      if(scope.filterBy){
        scope.images = filter(scope.images, scope.filterBy, parseInt(scope.separator));
      }

      //Initialize tracking:
      scope.currentIndex=0;
      
      //Get current number of images in the set (for scope.dots function):
      scope.numOfImgs = scope.images.length;
      
      //Represents slider state when page is first loaded (automatic mode activated):
      var sliderActive = true;
      
      //Will be used to clear $timeout in scope.refresh() function:
      var timer = null;
      
      //Create a copy of scope.images set, will be used in divide() function:
      var copy = scope.images.slice(0);

      //Dividing function:
      var divide = function(array, separator){
        var len = Math.ceil(array.length/separator);
        var result = []; 
        for(var i = 0; i < len; i++){
          result.push( {set : array.splice(0, separator)} );
        }
        return result;
      }

      //Create a new array from the copy of scope.images.
      //Each element of this new array is an object, whose 'set' property will 
      //contain the required portion of initial scope.images array
      //(quantity of images in one slide):
      if(scope.multiple) {
        scope.groupImgs = divide( copy, parseInt(scope.separator) || 3 );
      }

      //Create an array that will be used by ng-repeat to represent list of images as dots:
      scope.dots = function(num){
        return new Array(num);   
      };

      //Click the dot to select desired image:
      scope.setSelected = function(idx){
        scope.currentIndex = idx;
      };

      //Index value controls:
      scope.next = function(){
        if(scope.multiple){
          scope.currentIndex < scope.groupImgs.length-1 ? scope.currentIndex++ : scope.currentIndex = 0;
        } else {
          scope.currentIndex < scope.images.length-1 ? scope.currentIndex++ : scope.currentIndex = 0;
        }
      };
      scope.prev = function(){
        if(scope.multiple) {
          scope.currentIndex > 0 ? scope.currentIndex-- : scope.currentIndex = scope.groupImgs.length - 1;
        } else {
          scope.currentIndex > 0 ? scope.currentIndex-- : scope.currentIndex = scope.images.length - 1;
        }
      };

      //Set watcher to control visibility of images:
      scope.$watch('currentIndex', function(){
        if(scope.multiple) {
          scope.groupImgs.forEach(function(group){
            group.visible = false;
          });
          scope.groupImgs[scope.currentIndex].visible = true;
        } else {
          scope.images.forEach(function(image){
            image.visible = false;
          });
          scope.images[scope.currentIndex].visible = true;
        }
      });
      
      //Link image with product id:
      scope.goTo = function(a){
        if(a) {
          $location.path("/product/"+a);
        } else {
          $location.path("/shop");
        }

      }

      //Start slider automatically when page is loaded for first time.
      //If scope.duration is defined - use it, otherwise fall back to defalt value of 5000ms:
      var slideShow = $interval( scope.next, parseInt(scope.duration) || 5000 );

      //Functions to start and stop the slider:
      var stop = function(){
        if(sliderActive){
          $interval.cancel(slideShow);
          sliderActive = false;
        } else {
          return;
        }
      }

      var start = function(){
        if(sliderActive){
          return;
        } else {
          slideShow = $interval( function(){ scope.next(); }, parseInt(scope.duration) || 5000 );
          sliderActive = true;
        }
      }

      //The scope.refresh() function is most useful for mobile devices. 
      //A sort of an alrertative for mouseenter/mouseleave events. 
      //Allows to pause the slider for a while when any control button is clicked
      //(added as a second function to button's ng-click in template).
      scope.refresh = function(){
        if(timer) {
          $timeout.cancel(timer);
          timer = null;
        }
        stop();
        timer = $timeout(start, parseInt(scope.duration)*2);
      }
      
      //Set event handlers:
      element.on('mouseenter', function(){
        stop();
      });
      element.on('mouseleave', function(){
        start();
      });
      scope.$on("$destroy",function(){
        stop();
      });
      scope.$on("$routeChangeStart", function(){
        stop();
      });
      //Deal with modals:
      scope.getModal = function(a){
        scope.$emit("showModal", a);
      }

    }
  }
})
.directive("slideReady", function($window, $document){
  return function(scope, element, attrs){

    //Get raw DOM element (working with raw DOM here is required to avoid adding jQuery library):
    var domElem = angular.element(element)[0];
    
    //Traverse DOM and get required parents:
    var slide = element.parent();
    var slider = slide.parent();
    var imgHolder;

    //If scope.separator is defined, then redefine parents and set element's width dynamically.
    if(scope.separator) {
      imgHolder = element.parent();
      slide = imgHolder.parent();
      slider = slide.parent(); 
      imgHolder.css({"width": (100/scope.separator).toFixed(2)+"%"});
    }

    //Wrap $window object with jqLite to use its 'on' method:
    var win = angular.element($window);
    
    //When each image is loaded, check its height. 
    //Invisible image will return its height as string "auto".
    //Set slider's height to prevent collapsing effect from position:absolute;
    element.on("load", function(){
      var elemHeight = $window.getComputedStyle(domElem, null).height || domElem.currentStyle.height;
      if( parseInt(elemHeight) ) slider.css({"height": elemHeight});
    });
    
    //Calculate slider's height on each window's resize event:
    win.on("resize", function(){
      var elemHeight = $window.getComputedStyle(domElem, null).height || domElem.currentStyle.height;
      if( parseInt(elemHeight) ) slider.css({"height": elemHeight});
    });

    //Toggle visibility of overlay div on mouseenter/mouseleave events:
    scope.isHover = false;
    scope.toggleHover = function(){
      scope.isHover = !scope.isHover;
    }
  }
})
      //////////////////
      //END OF SLIDER://
      //////////////////
.directive("modal", function(){
  return {
    restrict: "E", 
    scope: {
      show: "="
    }, 
    replace: true,
    transclude: true,
    templateUrl: "partials/modal.html", 
    link: function(scope, element, attrs){
      scope.hideModal = function(){
        scope.$emit("closeModal");
      }
    }
  }
})

.directive("animHeight", function($interval, $window){
    return { 
    scope: {
      speed: "="
    },
    link: function(scope, element, attrs){
      var domElem = angular.element(element)[0];
      var domSibling = domElem.nextElementSibling;
      var nextElem = angular.element(domSibling);
      var start;
      //var start = parseInt($window.getComputedStyle(domSibling, null).height);
      var end = 0;
      var slidDown = false;
      scope.$on("newCategory", function(){
        nextElem.css("height","auto");
      });
      var opts = {
        frameTime: 10,
        speed: parseInt(scope.speed),
        delta: function(progress){
                return Math.pow(progress, 3);
              },
        stepDown: function(del){
                nextElem.css({"height": start + (end-start)*del + "px"});
              },
        stepUp: function(del){
                nextElem.css({"height": end + (start-end)*del + "px"});
              }

      };
      var animate = function(opts) {  
        var step;
        if(slidDown) {
            step = opts.stepUp;
            slidDown = !slidDown;
          } else {
            step = opts.stepDown;
            slidDown = !slidDown;
          }
        var begin = new Date;
        var id = $interval(function() {
          var timePassed = new Date - begin;
          var progress = timePassed / opts.speed || timePassed / 500;
          if (progress > 1) progress = 1;
          var delta = opts.delta(progress);
          step(delta);
          if (progress == 1) {
            $interval.cancel(id);
          }
        }, opts.frameTime);
      }
      element.on("click", function(){
        var localStart = parseInt($window.getComputedStyle(domSibling, null).height);
        if(start != localStart && localStart != 0) start = localStart;
        animate(opts);
      });

    }
  }
})
//Display a message when selected filters match no results;
.directive("noMatch", function(){
  return function(scope, element, attrs){
    scope.$watch(
      function(){
        return element.children().length;
      }, 
      function(newValue, oldValue){
        if(newValue == 3) scope.noResults = true;
        if(newValue > 3) scope.noResults = false;
      }
    );
  }
});