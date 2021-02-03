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

class ProfileDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = { updated: false, validEmail: true };
  }
  handleKeyPress(e) {
    if (e.nativeEvent.key === "Enter") this.updateUser();
  }
  updateState(name, value) {
    this.setState({
      [name]: value,
      updated: true,
    });
  }
  validateEmail() {
    var re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let email = this.state.EMAIL ? this.state.EMAIL : this.props.userData.EMAIL;
    let valid = re.test(String(email).toLowerCase());
    this.setState({ validEmail: valid });
    if (!valid) {
      throw new Error("Invalid email address");
    }
  }
  updateUser() {
    try {
      this.validateEmail();
    } catch (err) {
      //any errors will not create a new user
      return;
    }
    this.props.updateUser(this.state);
    this.closeProfileDialog();
  }
  closeProfileDialog() {
    this.props.onOk();
    this.setState({ updated: false, validEmail: true });
  }
  render() {
    return (
      <MarxanDialog
        {...this.props}
        contentWidth={330}
        offsetY={80}
        onCancel={this.closeProfileDialog.bind(this)}
        showCancelButton={true}
        onOk={this.updateUser.bind(this)}
        helpLink={"user.html#profile"}
        title="Profile"
        children={
          <div key="k15">
            <MarxanTextField
              floatingLabelText="Full name"
              floatingLabelFixed={true}
              onChange={(event, newValue) => this.updateState("NAME", newValue)}
              defaultValue={this.props.userData && this.props.userData.NAME}
              onKeyPress={this.handleKeyPress.bind(this)}
              floatingLabelShrinkStyle={{ fontSize: "16px" }}
              floatingLabelFocusStyle={{ fontSize: "16px" }}
            />
            <MarxanTextField
              floatingLabelText="Email address"
              floatingLabelFixed={true}
              errorText={this.state.validEmail ? "" : "Invalid email address"}
              onChange={(event, newValue) =>
                this.updateState("EMAIL", newValue)
              }
              defaultValue={this.props.userData && this.props.userData.EMAIL}
              onKeyPress={this.handleKeyPress.bind(this)}
              floatingLabelShrinkStyle={{ fontSize: "16px" }}
              floatingLabelFocusStyle={{ fontSize: "16px" }}
            />
            <div className={"description"}>
              Role: {this.props.userData.ROLE}
            </div>
          </div>
        }
      />
    );
  }
}

export default ProfileDialog;
