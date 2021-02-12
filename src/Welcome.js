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
import Notification from "./Notification.js";
import FlatButton from "material-ui/FlatButton";
import ToolbarButton from "./ToolbarButton";
import Checkbox from "material-ui/Checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { faDraftingCompass } from "@fortawesome/free-solid-svg-icons";
class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = { checked: true };
  }
  toggleShowWelcomeScreen(evt, isInputChecked) {
    this.setState({ checked: isInputChecked });
  }

  onOk() {
    this.props.saveOptions({ SHOWWELCOMESCREEN: this.state.checked });
    this.props.updateState({ welcomeDialogOpen: false });
  }
  openNewProjectDialog() {
    this.onOk();
    this.props.openNewProjectDialog();
  }
  render() {
    //get the visible notifications
    let notifications =
      this.props.notifications &&
      this.props.notifications.filter((item) => item.visible);
    notifications = notifications.map((item) => {
      return (
        <Notification
          html={item.html}
          type={item.type}
          key={item.id}
          removeNotification={this.props.removeNotification.bind(this, item)}
        ></Notification>
      );
    });
    let notificationsPanel = (
      <div className={"notifications"}>
        {notifications}
        <div className={"notificationPointer"}></div>
      </div>
    );
    return (
      <MarxanDialog
        {...this.props}
        contentWidth={768}
        offsetY={80}
        title="Welcome"
        helpLink={"user.html#welcome"}
        onOk={this.onOk.bind(this)}
        showCancelButton={false}
        autoDetectWindowHeight={false}
        bodyStyle={{ padding: "0px 24px 0px 24px" }}
        children={
          <React.Fragment key={"welcomeKey"}>
            <div className={"welcomeContent"}>
              <div className={"tabTitle"}>What do you want to do?</div>
              <div className={"task"}>
                <div className={"taskItem"}>
                  <ToolbarButton
                    icon={<FontAwesomeIcon icon={faDraftingCompass} />}
                    title={"Design a protected area network"}
                    onClick={this.openNewProjectDialog.bind(this)}
                    className={"resetNotifications"}
                  />
                  <span>Create a new protected area network for a country</span>
                </div>
                <div className={"taskItem"}>
                  <ToolbarButton
                    icon={<FontAwesomeIcon icon={faDraftingCompass} />}
                    title={"Extend a protected area network"}
                    onClick={this.openNewProjectDialog.bind(this)}
                    className={"resetNotifications"}
                  />
                  <span>
                    Extend an existing protected area network for a country
                  </span>
                </div>
                <div className={"taskItem"}>
                  <ToolbarButton
                    icon={<FontAwesomeIcon icon={faDraftingCompass} />}
                    title={"Do a gap analysis"}
                    onClick={this.openNewProjectDialog.bind(this)}
                    className={"resetNotifications"}
                  />
                  <span>Do a national gap analysis</span>
                </div>
              </div>
              <div style={{ verticalAlign: "middle" }}>
                <FlatButton
                  icon={<FontAwesomeIcon icon={faSync} />}
                  title={"Reset notifications"}
                  onClick={this.props.resetNotifications}
                  style={{
                    minWidth: "24px",
                    height: "24px",
                    lineHeight: "24px",
                    color: "rgba(0,0,0,0.67)",
                    position: "absolute",
                    bottom: "10px",
                  }}
                />
              </div>
              <div className={"notifications"}>{notificationsPanel}</div>
              <div className="welcomeToolbar">
                <Checkbox
                  label="Show at startup"
                  style={{ fontSize: "12px" }}
                  checked={this.state.checked}
                  onCheck={this.toggleShowWelcomeScreen.bind(this)}
                  className={"showAtStartupChk"}
                />
              </div>
            </div>
          </React.Fragment>
        }
      />
    );
  }
}

export default Welcome;
