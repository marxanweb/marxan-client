/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import React from "react";
import MarxanDialog from "./MarxanDialog";
import MarxanTextField from "./MarxanTextField";

class ResendPasswordDialog extends React.Component {
  handleKeyPress(e) {
    if (e.nativeEvent.key === "Enter") this.props.resendPassword();
  }
  render() {
    return (
      <React.Fragment>
        <MarxanDialog
          {...this.props}
          contentWidth={358}
          showCancelButton={true}
          okDisabled={!this.props.email || this.props.loading}
          cancelDisabled={this.props.resending}
          title="Resend password"
          children={[
            <div key="resendDiv">
              <MarxanTextField
                floatingLabelText="email address"
                onChange={(event, value) => this.props.changeEmail(value)}
                value={this.props.email}
                className="loginUserField"
                disabled={this.props.loading}
                onKeyPress={this.handleKeyPress.bind(this)}
              />
            </div>,
          ]}
          onRequestClose={this.props.onCancel}
        />
      </React.Fragment>
    );
  }
}

export default ResendPasswordDialog;
