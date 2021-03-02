/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import * as React from "react";
import { blue300 } from "material-ui/styles/colors";

class TargetIcon extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { editing: false, localTargetValue: undefined };
  }
  onClick(event) {
    this.startEditing();
  }
  isNumber(str) {
    var pattern = /^\d+$/;
    return pattern.test(str); // returns a boolean
  }
  onChange(event) {
    let newValue = event.nativeEvent.target.value;
    if (newValue > 100) return;
    if (this.isNumber(newValue) || newValue === "") {
      newValue = newValue === "" ? 0 : Number(newValue);
      this.setState({ localTargetValue: newValue });
    }
  }
  onKeyPress(event) {
    if (event.nativeEvent.key === "Enter") this.setState({ editing: false }); //will trigger the onBlur event of the input box
  }
  startEditing() {
    this.setState({ editing: true, localTargetValue: this.props.target_value });
    document.getElementById("input_" + this.props.interestFeature.id).focus();
    document.getElementById("input_" + this.props.interestFeature.id).select();
  }
  stopEditing() {
    this.setState({ editing: false });
    this.props.updateTargetValue(this, this.state.localTargetValue);
  }
  render() {
    let backgroundColor =
      this.props.targetStatus === "Does not occur in planning area"
        ? "lightgray"
        : this.props.targetStatus === "Unknown"
        ? "white"
        : this.props.targetStatus === "Target achieved"
        ? "white"
        : "rgb(255, 64, 129)";
    let fontColor =
      this.props.targetStatus === "Does not occur in planning area"
        ? "white"
        : this.props.targetStatus === "Unknown"
        ? blue300
        : this.props.targetStatus === "Target achieved"
        ? blue300
        : "white";
    return (
      <div
        onClick={
          this.props.userRole === "ReadOnly" ? null : this.onClick.bind(this)
        }
        style={{
          position: "absolute",
          left: "0px",
          top: "8px",
          display: this.props.visible ? "block" : "none",
        }}
      >
        <div
          title={this.props.targetStatus}
          style={{
            display: this.state.editing ? "none" : "inline-flex",
            backgroundColor: backgroundColor,
            size: "0",
            color: fontColor,
            userSelect: "none",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            borderRadius: "50%",
            height: "27px",
            width: "27px",
            left: "0px",
            border: "1px lightgray solid",
          }}
        >
          {this.props.target_value}%
        </div>
        <div
          style={{
            display: this.state.editing ? "inline-flex" : "none",
            size: "30",
            backgroundColor: "#2F6AE4",
            userSelect: "none",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            height: "27px",
            width: "27px",
            left: "0px",
          }}
        >
          <input
            id={"input_" + this.props.interestFeature.id}
            onBlur={this.stopEditing.bind(this)}
            onKeyPress={this.onKeyPress.bind(this)}
            onChange={this.onChange.bind(this)}
            style={{
              backgroundColor: "transparent",
              border: "0px",
              height: "27px",
              width: "27px",
              fontSize: "13px",
              display: "inline-flex",
              textAlign: "center",
              color: blue300,
            }}
            value={this.state.localTargetValue}
          />
        </div>
      </div>
    );
  }
}

export default TargetIcon;
