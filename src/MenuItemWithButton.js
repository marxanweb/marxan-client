/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import React from "react";
import MenuItem from "material-ui/MenuItem";

class MenuItemWithButton extends React.Component {
  render() {
    return (
      <MenuItem
        className={"smallMenuItem"}
        {...this.props}
        innerDivStyle={{ paddingLeft: "40px" }}
      />
    );
  }
}

export default MenuItemWithButton;
