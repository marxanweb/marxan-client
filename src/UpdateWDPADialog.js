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
import ToolbarButton from "./ToolbarButton";

class UpdateWDPADialog extends React.PureComponent {
  render() {
    let html =
      this.props.registry &&
      this.props.registry.WDPA.latest_version +
        " is available. Details <a href='" +
        (this.props.registry && this.props.registry.WDPA.metadataUrl) +
        "' target='_blank'>here</a>. Click below to update. ";
    return (
      <MarxanDialog
        {...this.props}
        contentWidth={380}
        offsetY={260}
        title="Update WDPA"
        children={
          <React.Fragment>
            <div
              style={{ display: this.props.newWDPAVersion ? "block" : "none" }}
            >
              <br />
              <div dangerouslySetInnerHTML={{ __html: html }} />
              <br />
              <ToolbarButton
                title="Update WDPA"
                onClick={this.props.updateWDPA}
                label="Update"
                disabled={this.props.loading}
              />
            </div>
          </React.Fragment>
        }
      />
    );
  }
}

export default UpdateWDPADialog;
