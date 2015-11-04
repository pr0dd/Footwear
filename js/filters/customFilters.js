angular.module("customFilters", [])
	.filter("unique", function() {
		return function(data, propertyName) {
			if( angular.isArray(data) && angular.isString(propertyName) ) {
				var customData = [];
				var keys = {};
				for(var i = 0; i<data.length; i++) {
					var val = data[i][propertyName];
					if( angular.isUndefined(keys[val]) ) {
						keys[val] = true;
						customData.push(val);
					
					}
				}
				return customData;
			} else {
				return data;
			}
		}
	})
	.filter("range", function($filter) {
		return function(data, pageNum, pageSize) {
			if( angular.isArray(data) && angular.isNumber(pageNum) && angular.isNumber(pageSize) ) {
				var start = (pageNum - 1)*pageSize;
				if(data.length<start){
					return [];
				} else {
					return $filter("limitTo")(data.splice(start,pageSize));
				}
			} else {
				return data;
			}
		}
	})
	.filter("pageCount", function(){
		return function(data, pageSize){
			if( angular.isArray(data) && angular.isNumber(pageSize) ) {
				var result = [];
				//Same thing with Math.ceil - not at all necessary. 
				//The filter will work fine without it;
				for(var i = 0; i < Math.ceil(data.length/pageSize); i++){
					result.push(i);
				}
				return result;
			} else {
				return data;
			}
		}
	})
	.filter("arrayValues", function(){
		return function(data, property){
			if( angular.isArray(data) && angular.isString(property) ) {
				var sort = function(array){
					var values = [];
					var keys = {};
					for(var i = 0; i < array.length; i++){
						var val = array[i];
						if( angular.isUndefined(keys[val]) ) {
							keys[val] = true;
							values.push(val);
						}
					}
					return values;
				}
				var results = [];
				for(var i = 0; i < data.length; i++){
					var val = data[i][property];
					if( angular.isArray(val) ){
						results.push.apply(results, val);
					}
				}
				return sort(results);
			} else {
				return data;
			}
		}
	});
