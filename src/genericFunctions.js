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
	},
	//returns the area in the passed units, e.g. getArea(10000,'m2') will return 10000
    getArea: function(value, units){
        let scale;
        switch (units) {
            case 'm2':
                scale = 1;
                break;
            case 'ha':
                scale = 0.0001;
                break;
            case 'km2':
                scale = 0.000001;
                break;
            default:
                // code
        }
        return Number((value * scale).toFixed(6)); //to 6 decimal places for m2
    },
  //zooms the passed map to the passed bounds
  zoomToBounds: function (map, bounds) {
  	//if the bounds span the dateline, then we can force the map to fit the bounds of a polygon from [[179,minLat],[180,maxLat]]
    let minLng = (bounds[0] === -180) ? 179 : bounds[0];
    let maxLng = bounds[2];
    if (bounds[0] < 0  && bounds[2] > 0){
    	//if the bounds are from -1xx to 1xx then see if the range is bigger from -1xx to 1xx or from 1xx to -1xx
    	let lngSpanAcrossMeridian = (bounds[2]) - bounds[0];
    	let lngSpanAcrossDateline = (bounds[0] + 180) + (180 - bounds[2]);
    	//if the lng range is smaller across the dateline, then set the minLng and maxLng
    	if (lngSpanAcrossMeridian > lngSpanAcrossDateline){
    		minLng = bounds[2];
    		maxLng = bounds[0] + 360;
    	}
    }
    map.fitBounds([minLng, bounds[1], maxLng, bounds[3]], { padding: { top: 10, bottom: 10, left: 10, right: 10 }, easing: (num) => { return 1; } });
  }
};