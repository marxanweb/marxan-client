/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import React from "react";
// returns a boolean if it is a valid number
export function isNumber(str) {
  var pattern = /^\d+$/;
  return pattern.test(str);
}
export function isValidTargetValue(value) {
  if (isNumber(value)) {
    if (value <= 100 && value >= 0) {
      return true;
    }
  }
  return false;
}
export function getMaxNumberOfClasses(brew, colorCode) {
  //get the color scheme
  let colorScheme = brew.colorSchemes[colorCode];
  //get the names of the properties for the colorScheme
  let properties = Object.keys(colorScheme).filter(function (key) {
    return key !== "properties";
  });
  //get them as numbers
  let numbers = properties.map((property) => {
    return Number(property);
  });
  //get the maximum number of colors in this scheme
  let colorSchemeLength = numbers.reduce(function (a, b) {
    return Math.max(a, b);
  });
  return colorSchemeLength;
}
export function getArea(value, units, asHtml, sf = 3, addcommas = true) {
  let scale;
  switch (units) {
    case "m2":
      scale = 1;
      break;
    case "Ha":
      scale = 0.0001;
      break;
    case "Km2":
      scale = 0.000001;
      break;
    default:
    // code
  }
  let _value = Number((value * scale).toPrecision(sf));
  _value =
    addcommas && _value > 1000
      ? _value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : _value.toString();
  let _units =
    units.indexOf("2") !== -1 ? (
      <span>
        {units.substr(0, units.indexOf("2"))}
        <span className="superscript">2</span>
      </span>
    ) : (
      <span>{units}</span>
    );
  if (asHtml) {
    return (
      <span>
        {_value} {_units}
      </span>
    );
  } else {
    return _value + " " + units;
  }
}
//zooms the passed map to the passed bounds
export function zoomToBounds(map, bounds) {
  //if the bounds span the dateline, then we can force the map to fit the bounds of a polygon from [[179,minLat],[180,maxLat]]
  let minLng = bounds[0] === -180 ? 179 : bounds[0];
  let maxLng = bounds[2];
  if (bounds[0] < 0 && bounds[2] > 0) {
    //if the bounds are from -1xx to 1xx then see if the range is bigger from -1xx to 1xx or from 1xx to -1xx
    let lngSpanAcrossMeridian = bounds[2] - bounds[0];
    let lngSpanAcrossDateline = bounds[0] + 180 + (180 - bounds[2]);
    //if the lng range is smaller across the dateline, then set the minLng and maxLng
    if (lngSpanAcrossMeridian > lngSpanAcrossDateline) {
      minLng = bounds[2];
      maxLng = bounds[0] + 360;
    }
  }
  map.fitBounds([minLng, bounds[1], maxLng, bounds[3]], {
    padding: { top: 10, bottom: 10, left: 10, right: 10 },
    easing: (num) => {
      return 1;
    },
  });
}
