const arr: any = {	
	max: function(array: any) {
		return Math.max.apply(null, array);
	},
	
	min: function(array: any) {
		return Math.min.apply(null, array);
	},
	
	range: function(array: any) {
		return arr.max(array) - arr.min(array);
	},
	
	midrange: function(array: any) {
		return arr.range(array) / 2;
	},

	sum: function(array: any) {
		var num = 0;
		for (var i = 0, l = array.length; i < l; i++) num += array[i];
		return num;
	},
	
	mean: function(array: any) {
		return arr.sum(array) / array.length;
	},
	
	median: function(array: any) {
		array.sort(function(a: any, b: any) {
			return a - b;
		});
		var mid = array.length / 2;
		return mid % 1 ? array[mid - 0.5] : (array[mid - 1] + array[mid]) / 2;
	},
	
	modes: function(array: any): any {
		if (!array.length) return [];
		var modeMap: any = {},
			maxCount: any = 0,
			modes: any = [];

		array.forEach(function(val: any) {
			if (!modeMap[val]) modeMap[val] = 1;
			else modeMap[val]++;

			if (modeMap[val] > maxCount) {
				modes = [val];
				maxCount = modeMap[val];
			}
			else if (modeMap[val] === maxCount) {
				modes.push(val);
				maxCount = modeMap[val];
			}
		});
		return modes;
	},
	
	variance: function(array: any) {
		var mean = arr.mean(array);
		return arr.mean(array.map(function(num: any) {
			return Math.pow(num - mean, 2);
		}));
	},
	
	standardDeviation: function(array: any) {
		return Math.sqrt(arr.variance(array));
	},
	
	meanAbsoluteDeviation: function(array:any) {
		var mean = arr.mean(array);
		return arr.mean(array.map(function(num:any) {
			return Math.abs(num - mean);
		}));
	},
	
	zScores: function(array:any) {
		var mean = arr.mean(array);
		var standardDeviation = arr.standardDeviation(array);
		return array.map(function(num:any) {
			return (num - mean) / standardDeviation;
		});
	}
};

// Function aliases:
arr.average = arr.mean;


export default arr;