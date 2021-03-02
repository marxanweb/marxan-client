/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import React from "react";
import Hexagon from "react-hexagon";

class Swatch extends React.Component {
  render() {
    //get a slightly wider line if the fill-color is not specified
    let lineWidth = this.props.item.fillColor === "none" ? "1.5px" : "1px";
    switch (this.props.shape) {
      case "hexagon":
        return (
          <div className={"hexDiv"}>
            <Hexagon
              className={"hexLegendItem"}
              style={{
                fill: this.props.item.fillColor,
                stroke: this.props.item.strokeColor,
                strokeWidth: 30,
              }}
            />
          </div>
        );
      default:
        return (
          <div
            style={{
              backgroundColor: this.props.item.fillColor,
              width: "14px",
              height: "16px",
              border: this.props.item.strokeColor + " " + lineWidth + " solid",
              margin: "3px",
              display: "inline-flex",
              verticalAlign: "top",
            }}
          ></div>
        );
    }
  }
}

export default Swatch;
