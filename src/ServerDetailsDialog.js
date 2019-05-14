import React from "react";
import MarxanDialog from "./MarxanDialog";

class ServerDetailsDialog extends React.Component {
  render() {
    // add the following if necessary
    // <div className="serverDetails">Release: {this.props.marxanServer&&this.props.marxanServer.release}</div>
    // <div className="serverDetails">Version: {this.props.marxanServer&&this.props.marxanServer.version}</div>
    // <div className="serverDetails">Processor: {this.props.marxanServer&&this.props.marxanServer.processor}</div>
    return (
      <MarxanDialog
        {...this.props}
        contentWidth={500}
        offsetY={80}
        title="Server Details"
        children={
          <div key="k5">
            <div className="serverDetails">Name: {this.props.marxanServer&&this.props.marxanServer.name}</div>
            <div className="serverDetails">Host: {this.props.marxanServer&&this.props.marxanServer.host}</div>
            <div className="serverDetails">Description: {this.props.marxanServer&&this.props.marxanServer.description}</div>
            <div className="serverDetails">System: {this.props.marxanServer&&this.props.marxanServer.system}</div>
            <div className="serverDetails">Marxan Server version: {this.props.marxanServer&&this.props.marxanServer.server_version}</div>
            {(this.props.marxanServer&&this.props.marxanServer.client_version!=='Not installed') ? <div className="serverDetails">Marxan Client version: {this.props.marxanServer&&this.props.marxanServer.client_version}</div> : null}
          </div>
        }
      />
    );
  }
}

export default ServerDetailsDialog;
