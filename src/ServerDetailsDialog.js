import React from "react";
import MarxanDialog from "./MarxanDialog";
import ToolbarButton from './ToolbarButton';

class ServerDetailsDialog extends React.Component {
  render() {
    // add the following if necessary
    // <div className="tabTitle">Release: {this.props.marxanServer&&this.props.marxanServer.release}</div>
    // <div className="tabTitle">Version: {this.props.marxanServer&&this.props.marxanServer.version}</div>
    // <div className="tabTitle">Processor: {this.props.marxanServer&&this.props.marxanServer.processor}</div>
    return (
      <MarxanDialog
        {...this.props}
        contentWidth={500}
        offsetY={80}
        title="Server Details"
        helpLink={"docs_user.html#server-details"}
        children={
          <div key="k5">
            <div className="tabTitle">Name:</div><div className="serverDetails">{this.props.marxanServer&&this.props.marxanServer.name}</div>
            <div className="tabTitle">Host:</div><div className="serverDetails">{this.props.marxanServer&&this.props.marxanServer.host}</div>
            <div className="tabTitle">Description:</div><div className="serverDetails">{this.props.marxanServer&&this.props.marxanServer.description}</div>
            <div className="tabTitle">System:</div><div className="serverDetails">{this.props.marxanServer&&this.props.marxanServer.system}</div>
            <div className="tabTitle">Disk space:</div><div className="serverDetails">{this.props.marxanServer&&this.props.marxanServer.disk_space}Mb</div>
            <div className="tabTitle">Marxan Server version:</div><div className="serverDetails">{this.props.marxanServer&&this.props.marxanServer.server_version}</div>
            <div className="tabTitle">WDPA version:</div><div className="serverDetails">{this.props.marxanServer&&this.props.marxanServer.wdpa_version}</div>
            <div style={{display: (this.props.newWDPAVersion ? 'block' : 'none')}}>
              <br/>
              <div className="tabTitle" dangerouslySetInnerHTML={{ __html: window.WDPA.latest_version + " is available. Details <a href='" + window.WDPA.metadataUrl + "' target='_blank'>here</a>. Click below to update. "}}/>
							<br/>
							<ToolbarButton title="Update WDPA" onClick={this.props.updateWDPA} label="Update" disabled={this.props.loading}/>
            </div>
          </div>
        }
      />
    );
  }
}

export default ServerDetailsDialog;
