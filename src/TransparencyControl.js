/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import React from "react";
import Slider from "material-ui/Slider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faEyeSlash } from "@fortawesome/free-regular-svg-icons";

class TransparencyControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSlider: false,
    };
    this.old_opacity = 0.5;
  }
  onChange(evt, newValue) {
    //set a local property to capture the old opacity
    this.old_opacity = this.props.opacity;
    this.props.changeOpacity(newValue);
  }

  toggleLayer() {
    //see if the layer is currently visible
    if (this.props.opacity > 0) {
      //hide the layer
      this.onChange(undefined, 0);
    } else {
      //show the layer
      this.onChange(undefined, this.old_opacity);
    }
  }
  mouseEnter(event) {
    this.setState({
      showSlider: true,
    });
  }

  mouseLeave(event) {
    this.setState({
      showSlider: false,
    });
  }

  render() {
    return (
      <div
        className={"transparencyControl"}
        onMouseEnter={this.mouseEnter.bind(this)}
        onMouseLeave={this.mouseLeave.bind(this)}
        title={"Click to toggle visibility"}
      >
        <div className={"opacityToggleContainer"}>
          <FontAwesomeIcon
            icon={this.props.opacity === 0 ? faEyeSlash : faEye}
            style={{ color: "gainsboro" }}
            onClick={this.toggleLayer.bind(this)}
          />
        </div>
        <Slider
          value={this.props.opacity}
          onChange={this.onChange.bind(this)}
          className={"opacitySlider"}
          style={{
            display: this.state.showSlider ? "inline-block" : "none",
            width: "100px",
          }}
          sliderStyle={{ margin: "0px" }}
        />
      </div>
    );
  }
}

export default TransparencyControl;
