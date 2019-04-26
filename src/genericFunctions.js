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
	}
};