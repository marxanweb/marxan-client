/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import React from "react";
import RaisedButton from "material-ui/RaisedButton";

class ToolbarButton extends React.Component {
  render() {
    //merge any user passed style
    let _style1 = this.props.style ? this.props.style : {};
    let _style2 = {
      display: this.props.show !== false ? "inline-block" : "none",
      marginLeft: "4px",
      marginRight: "4px",
      padding: "0px",
      minWidth: "30px",
      width: this.props.label ? "" : "24px",
      height: "24px",
    };
    Object.assign(_style1, _style2);
    return (
      <RaisedButton
        {...this.props}
        style={_style1}
        overlayStyle={{ lineHeight: "24px", height: "24px" }}
        buttonStyle={{ lineHeight: "24px", height: "24px" }}
      />
    );
  }
}

export default ToolbarButton;
