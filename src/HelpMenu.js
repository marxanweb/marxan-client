/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import React from "react";
import CONSTANTS from "./constants";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import Popover from "material-ui/Popover";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

class HelpMenu extends React.Component {
  openDocumentation() {
    window.open(CONSTANTS.DOCS_ROOT);
  }

  render() {
    return (
      <React.Fragment>
        <Popover
          open={this.props.open}
          anchorEl={this.props.menuAnchor}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
          targetOrigin={{ horizontal: "left", vertical: "top" }}
          onRequestClose={this.props.hideHelpMenu}
        >
          <Menu
            desktop={true}
            onMouseLeave={this.props.hideHelpMenu}
            menuItemStyle={{
              backgroundColor: "rgb(0, 188, 212)",
              color: "white",
            }}
            listStyle={{ width: "120px", backgroundColor: "rgb(0, 188, 212)" }}
            selectedMenuItemStyle={{ color: "rgb(24,24,24)" }}
            width={"102px"}
          >
            <MenuItem
              primaryText="Documentation"
              onClick={this.openDocumentation.bind(this)}
              leftIcon={
                <FontAwesomeIcon
                  style={{ height: "18px", marginTop: "4px", fontSize: "18px" }}
                  icon={faQuestionCircle}
                  color={"white"}
                />
              }
            />
            <MenuItem
              primaryText="About"
              onClick={this.props.openAboutDialog}
              leftIcon={
                <FontAwesomeIcon
                  style={{ height: "18px", marginTop: "4px", fontSize: "18px" }}
                  icon={faInfoCircle}
                  color={"white"}
                />
              }
            />
          </Menu>
        </Popover>
      </React.Fragment>
    );
  }
}

export default HelpMenu;
