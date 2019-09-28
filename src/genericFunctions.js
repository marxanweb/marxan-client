module.exports = {
	// returns a boolean if it is a valid number
	isNumber: function (str) {
		var pattern = /^\d+$/;
		return pattern.test(str); 
	},
	isValidTargetValue: function (value) {
		if (module.exports.isNumber(value)){
			if ((value<=100)&&(value>=0)){
				return true;
			}
		}
		return false;
	},
	getMaxNumberOfClasses: function(brew, colorCode) {
		//get the color scheme
		let colorScheme = brew.colorSchemes[colorCode];
		//get the names of the properties for the colorScheme
		let properties = Object.keys(colorScheme).filter(function(key) { return (key !== 'properties'); });
		//get them as numbers
		let numbers = properties.map((property) => { return Number(property) });
		//get the maximum number of colors in this scheme
		let colorSchemeLength = numbers.reduce(function(a, b) {
			return Math.max(a, b);
		});
		return colorSchemeLength;
	}
};