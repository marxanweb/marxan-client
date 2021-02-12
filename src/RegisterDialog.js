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

class RegisterDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validForm: false,
      user: undefined,
      name: undefined,
      email: undefined,
      validEmail: true,
    };
  }
  //
  createNewUser() {
    //check the required FIELDS
    try {
      this.validateEmail();
    } catch (err) {
      //any errors will not create a new user
      switch (err.message) {
        default:
        // code
      }
      return;
    }
    //create a new user
    this.props.onOk(
      this.state.user,
      this.state.password,
      this.state.name,
      this.state.email
    );
  }

  validateEmail() {
    var re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let valid = re.test(String(this.state.email).toLowerCase());
    this.setState({ validEmail: valid });
    if (!valid) {
      throw new Error("Invalid email address");
    }
  }

  render() {
    let c = [
      <div key="RegisterDialogDiv">
        <MarxanTextField
          floatingLabelText="Username"
          onChange={(event, newValue) => this.setState({ user: newValue })}
        />
        <MarxanTextField
          floatingLabelText="Password"
          type="password"
          onChange={(event, newValue) => this.setState({ password: newValue })}
        />
        <MarxanTextField
          floatingLabelText="Full name"
          onChange={(event, newValue) => this.setState({ name: newValue })}
        />
        <MarxanTextField
          floatingLabelText="Email address"
          errorText={this.state.validEmail ? "" : "Invalid email address"}
          onChange={(event, newValue) => this.setState({ email: newValue })}
        />
      </div>,
    ];
    return (
      <MarxanDialog
        {...this.props}
        contentWidth={358}
        onOk={this.createNewUser.bind(this)}
        okDisabled={
          !(
            this.state.user &&
            this.state.password &&
            this.state.name &&
            this.state.email
          ) || this.props.loading
        }
        showCancelButton={true}
        cancelDisabled={this.props.loading}
        helpLink={"user.html#new-user-registration"}
        title="Register"
        children={c}
        onRequestClose={() =>
          this.props.updateState({ registerDialogOpen: false })
        }
      />
    );
  }
}

export default RegisterDialog;
