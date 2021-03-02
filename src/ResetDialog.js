/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import * as React from "react";
import MarxanDialog from "./MarxanDialog";

class ResetDialog extends React.PureComponent {
  render() {
    return (
      <MarxanDialog
        {...this.props}
        contentWidth={240}
        title="Reset database"
        okLabel="Yes"
        cancelLabel="No"
        showCancelButton={true}
        children={<div>Are you sure you want to reset?</div>}
      />
    );
  }
}

export default ResetDialog;
