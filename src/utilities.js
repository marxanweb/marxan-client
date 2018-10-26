//gets the maximum number of classes in the brew color scheme
export function getMaxNumberOfClasses(brew, colorCode) {
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
