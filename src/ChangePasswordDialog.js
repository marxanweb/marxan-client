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

class ChangePasswordDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currentPassword: "", newPassword1: "", newPassword2: "" };
  }
  setCurrentPassword(event, newValue) {
    this.setState({ currentPassword: newValue });
  }
  setNewPassword1(event, newValue) {
    this.setState({ newPassword1: newValue });
  }
  setNewPassword2(event, newValue) {
    this.setState({ newPassword2: newValue });
  }
  onOk(evt) {
    if (this.state.newPassword2 !== this.state.newPassword1) {
      this.passwordsDontMatch();
      return;
    }
    this.props
      .checkPassword(this.props.user, this.state.currentPassword)
      .then((response) => {
        this.props
          .updateUser({ PASSWORD: this.state.newPassword1 })
          .then((response) => {
            this.props.setSnackBar("Password updated");
            this.props.onOk();
          })
          .catch((error) => {
            this.props.setSnackBar("Password not updated");
          });
      })
      .catch((response) => {
        this.props.setSnackBar("Invalid password");
      });
  }
  passwordsDontMatch() {
    this.props.setSnackBar("Passwords don't match");
  }
  render() {
    return (
      <MarxanDialog
        {...this.props}
        onOk={this.onOk.bind(this)}
        showCancelButton={true}
        onCancel={this.props.onOk}
        helpLink={"user.html#change-password"}
        contentWidth={358}
        offsetY={80}
        title="Change Password"
        children={
          <div key="k5">
            <MarxanTextField
              floatingLabelText="Current password"
              onChange={this.setCurrentPassword.bind(this)}
              floatingLabelShrinkStyle={{ fontSize: "16px" }}
              floatingLabelFocusStyle={{ fontSize: "16px" }}
              type="password"
            />
            <MarxanTextField
              floatingLabelText="New password"
              onChange={this.setNewPassword1.bind(this)}
              floatingLabelShrinkStyle={{ fontSize: "16px" }}
              floatingLabelFocusStyle={{ fontSize: "16px" }}
              type="password"
            />
            <MarxanTextField
              floatingLabelText="Repeat password"
              onChange={this.setNewPassword2.bind(this)}
              floatingLabelShrinkStyle={{ fontSize: "16px" }}
              floatingLabelFocusStyle={{ fontSize: "16px" }}
              type="password"
            />
          </div>
        }
      />
    );
  }
}

export default ChangePasswordDialog;
