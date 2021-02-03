/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import React from "react";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import Popover from "material-ui/Popover";
import LogOut from "material-ui/svg-icons/action/exit-to-app";
import { white } from "material-ui/styles/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faUserLock } from "@fortawesome/free-solid-svg-icons";

class UserMenu extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Popover
          open={this.props.open}
          anchorEl={this.props.menuAnchor}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
          targetOrigin={{ horizontal: "left", vertical: "top" }}
          onRequestClose={this.props.hideUserMenu}
        >
          <Menu
            desktop={true}
            onMouseLeave={this.props.hideUserMenu}
            menuItemStyle={{
              backgroundColor: "rgb(0, 188, 212)",
              color: "white",
            }}
            listStyle={{ width: "120px", backgroundColor: "rgb(0, 188, 212)" }}
            selectedMenuItemStyle={{ color: "rgb(24,24,24)" }}
          >
            {/*<MenuItem primaryText={this.props.user + " (" + this.props.userRole + ")"} style={{marginLeft:'40px'}}/>*/}
            <MenuItem
              style={{
                display: this.props.userRole !== "ReadOnly" ? "block" : "none",
              }}
              primaryText="Settings"
              onClick={this.props.openUserSettingsDialog.bind(this)}
              leftIcon={
                <FontAwesomeIcon
                  style={{ fontSize: "20px", marginBottom: "7px" }}
                  icon={faCog}
                  color={"white"}
                />
              }
            />
            <MenuItem
              style={{
                display: this.props.userRole !== "ReadOnly" ? "block" : "none",
              }}
              primaryText="Profile"
              onClick={this.props.openProfileDialog}
              leftIcon={
                <FontAwesomeIcon
                  style={{ fontSize: "20px", marginBottom: "7px" }}
                  icon={faEdit}
                  color={"white"}
                />
              }
            />
            <MenuItem
              style={{
                display: this.props.userRole !== "ReadOnly" ? "block" : "none",
              }}
              primaryText="Change password"
              onClick={this.props.openChangePasswordDialog}
              leftIcon={
                <FontAwesomeIcon
                  style={{ fontSize: "20px", marginBottom: "7px" }}
                  icon={faUserLock}
                  color={"white"}
                />
              }
            />
            <MenuItem
              primaryText="Log out"
              onClick={this.props.logout.bind(this)}
              leftIcon={<LogOut color={white} />}
            />
          </Menu>
        </Popover>
      </React.Fragment>
    );
  }
}

export default UserMenu;
