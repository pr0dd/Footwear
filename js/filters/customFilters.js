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
					//$filter limitTo is not necessary;
					//It is here to show how it can be used;
					//So range will work fine without it;
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
	});
