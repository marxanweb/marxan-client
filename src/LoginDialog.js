/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUnlink } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import MarxanDialog from "./MarxanDialog";
import MarxanTextField from "./MarxanTextField";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";

class LoginDialog extends React.Component {
  handleKeyPress(e) {
    if (e.nativeEvent.key === "Enter") this.props.onOk();
  }
  selectServer(evt, key, value) {
    this.props.selectServer(this.props.marxanServers[key]);
  }
  render() {
    return (
      <React.Fragment>
        <MarxanDialog
          {...this.props}
          showOverlay={true}
          okDisabled={
            !this.props.user ||
            !this.props.password ||
            !this.props.marxanServer ||
            (this.props.marxanServer && this.props.marxanServer.offline)
              ? true
              : false
          }
          okLabel={
            this.props.marxanServer &&
            !this.props.marxanServer.offline &&
            !this.props.marxanServer.corsEnabled &&
            this.props.marxanServer.guestUserEnabled
              ? "Login (Read-Only)"
              : "Login"
          }
          showCancelButton={true}
          cancelLabel={"Register"}
          cancelDisabled={
            this.props.marxanServer === undefined ||
            (this.props.marxanServer && this.props.marxanServer.offline) ||
            (this.props.marxanServer && !this.props.marxanServer.corsEnabled)
              ? true
              : false
          }
          helpLink={"user.html#log-in-window"}
          contentWidth={358}
          offsetY={200}
          children={[
            <div key="21">
              <SelectField
                id="SelectMarxanServer"
                floatingLabelText={"Marxan Server"}
                floatingLabelFixed={true}
                underlineShow={false}
                menuItemStyle={{ fontSize: "12px" }}
                labelStyle={{ fontSize: "12px" }}
                style={{ width: "320px" }}
                value={this.props.marxanServer && this.props.marxanServer.name}
                onChange={this.selectServer.bind(this)}
                children={this.props.marxanServers.map((item) => {
                  //if the server is offline - just put that otherwise: if CORS is enabled for this domain then it is read/write otherwise: if the guest user is enabled then put the domain and read only otherwise: put the domain and guest user disabled
                  let text = item.offline
                    ? item.name
                    : item.corsEnabled
                    ? item.name
                    : item.guestUserEnabled
                    ? item.name
                    : item.name + " (Guest user disabled)";
                  return (
                    <MenuItem
                      value={item.name}
                      key={item.name}
                      primaryText={text}
                      style={{ fontSize: "12px" }}
                      innerDivStyle={{ padding: "0px 10px 0px 52px" }}
                      leftIcon={
                        item.offline ? (
                          <FontAwesomeIcon
                            style={{ height: "12px", marginTop: "5px" }}
                            icon={faUnlink}
                          />
                        ) : item.corsEnabled ? null : (
                          <FontAwesomeIcon
                            style={{ height: "12px", marginTop: "5px" }}
                            icon={faLock}
                          />
                        )
                      }
                      title={
                        item.offline
                          ? item.host + " (offline)\n" + item.description
                          : item.corsEnabled
                          ? item.host + "\n" + item.description
                          : item.guestUserEnabled
                          ? item.host + " (read-only)\n" + item.description
                          : item.host +
                            " (guest user disabled)\n" +
                            item.description
                      }
                    />
                  );
                })}
              />
              <div style={{ height: "124px" }} id="logindiv" key="logindiv">
                <MarxanTextField
                  id="TextUsername"
                  style={{ marginTop: "-14px" }}
                  floatingLabelText="Username"
                  onChange={(event, value) => this.props.changeUserName(value)}
                  value={this.props.user}
                  disabled={
                    this.props.loading ||
                    (this.props.marxanServer &&
                      !this.props.marxanServer.corsEnabled)
                      ? true
                      : false
                  }
                  onKeyPress={this.handleKeyPress.bind(this)}
                />
                <MarxanTextField
                  id="TextPassword"
                  floatingLabelText="Password"
                  type="password"
                  onChange={(event, value) => this.props.changePassword(value)}
                  value={this.props.password}
                  disabled={
                    this.props.loading ||
                    (this.props.marxanServer &&
                      !this.props.marxanServer.corsEnabled)
                      ? true
                      : false
                  }
                  onKeyPress={this.handleKeyPress.bind(this)}
                />
                {/*<span onClick={() => this.props.updateState({ resendPasswordDialogOpen: true })} className="forgotLink" title="Click to resend password">Forgot</span>*/}
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: "4px",
                  fontSize: "11px",
                }}
              >
                {this.props.marxanClientReleaseVersion}
              </div>
            </div>,
          ]}
          onRequestClose={this.props.onOk}
          title="Login"
          modal={true}
        />
      </React.Fragment>
    );
  }
}

export default LoginDialog;
