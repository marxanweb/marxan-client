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

class LoadingDialog extends React.Component {
  render() {
    return (
      <React.Fragment>
        <MarxanDialog
          {...this.props}
          showOverlay={true}
          showCancelButton={false}
          hideOKButton={true}
          contentWidth={358}
          title="Loading.."
          modal={true}
        />
      </React.Fragment>
    );
  }
}

export default LoadingDialog;
