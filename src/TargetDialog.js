/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import * as React from "react";
import MarxanDialog from "./MarxanDialog";
import MarxanTextField from "./MarxanTextField";
import { isValidTargetValue } from "./Helpers.js";

class TargetDialog extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { target_value: 17, validTarget: true };
  }
  handleKeyPress(e) {
    if (e.nativeEvent.key === "Enter") this.validateTarget();
  }
  validateTarget() {
    let _validTarget = isValidTargetValue(this.state.target_value);
    this.setState({ validTarget: _validTarget });
    if (_validTarget) {
      this.props.updateTargetValueForFeatures(this.state.target_value);
      this.props.onOk();
    }
  }
  onOk() {
    this.validateTarget();
  }
  render() {
    return (
      <MarxanDialog
        {...this.props}
        contentWidth={240}
        offsetX={80}
        offsetY={260}
        title="Target for all features"
        onOk={this.onOk.bind(this)}
        children={
          <React.Fragment>
            <MarxanTextField
              style={{ fontSize: "13px", width: "70px" }}
              id={"commonTarget"}
              onChange={(event, newValue) =>
                this.setState({ target_value: newValue })
              }
              defaultValue={this.state.target_value}
              onKeyPress={this.handleKeyPress.bind(this)}
              floatingLabelShrinkStyle={{ fontSize: "16px" }}
              floatingLabelFocusStyle={{ fontSize: "16px" }}
              errorText={this.state.validTarget ? "" : "Invalid target"}
            />
          </React.Fragment>
        }
      />
    );
  }
}

export default TargetDialog;
