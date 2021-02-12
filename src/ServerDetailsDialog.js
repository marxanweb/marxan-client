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
import ReactTable from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

class ServerDetailsDialog extends React.Component {
  renderWithIcon(cellInfo) {
    let newServerSoftware =
      cellInfo.row.key === "Marxan Server version" &&
      this.props.marxanServer.server_version !==
        this.props.registry.SERVER_VERSION;
    return (
      <React.Fragment>
        <div style={{ float: "left" }}>{cellInfo.row.value}</div>
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          style={{
            color: "red",
            display:
              cellInfo.row.key === "Disk space" &&
              cellInfo.row.value.substr(0, 1) === "0"
                ? "inline"
                : "none",
            right: "5px",
            position: "absolute",
            marginTop: "5px",
          }}
          title={"Disk space running low"}
        />
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          style={{
            color: "red",
            display: newServerSoftware ? "inline" : "none",
            right: "5px",
            position: "absolute",
            marginTop: "5px",
          }}
          title={
            "A new version of Marxan Server is available (" +
            this.props.registry.SERVER_VERSION +
            ")"
          }
        />
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          style={{
            color: "red",
            display:
              cellInfo.row.key === "WDPA version" && this.props.newWDPAVersion
                ? "inline"
                : "none",
            position: "absolute",
            right: "5px",
            marginTop: "5px",
          }}
          title={"A new version of the WDPA is available - click for details"}
          onClick={() => this.props.updateState({ updateWDPADialogOpen: true })}
        />
      </React.Fragment>
    );
  }
  render() {
    let data = this.props.marxanServer
      ? [
          { key: "Name", value: this.props.marxanServer.name },
          { key: "Description", value: this.props.marxanServer.description },
          { key: "Host", value: this.props.marxanServer.host },
          //   {key:'Port',value:this.props.marxanServer.port},
          { key: "System", value: this.props.marxanServer.system },
          { key: "Processors", value: this.props.marxanServer.processor_count },
          { key: "Disk space", value: this.props.marxanServer.disk_space },
          { key: "RAM", value: this.props.marxanServer.ram },
          {
            key: "Marxan Server version",
            value: this.props.marxanServer.server_version,
          },
          { key: "WDPA version", value: this.props.marxanServer.wdpa_version },
          {
            key: "Planning grid units limit",
            value: this.props.marxanServer.planning_grid_units_limit,
          },
          {
            key: "Shutdown",
            value: this.props.marxanServer.shutdowntime
              ? new Date(this.props.marxanServer.shutdowntime).toLocaleString()
              : "Never",
          },
        ]
      : [];
    // add the following if necessary
    // <div className="tabTitle">Release: {this.props.marxanServer&&this.props.marxanServer.release}</div>
    // <div className="tabTitle">Version: {this.props.marxanServer&&this.props.marxanServer.version}</div>
    // <div className="tabTitle">Processor: {this.props.marxanServer&&this.props.marxanServer.processor}</div>
    return (
      <MarxanDialog
        {...this.props}
        contentWidth={445}
        offsetY={80}
        title="Server Details"
        helpLink={"user.html#server-details"}
        children={[
          <ReactTable
            showPagination={false}
            className={"server_details_infoTable"}
            minRows={0}
            pageSize={data.length}
            data={data}
            noDataText=""
            key="k27"
            columns={[
              {
                Header: "Parameter",
                accessor: "key",
                width: 144,
                headerStyle: { textAlign: "left" },
              },
              {
                Header: "Value",
                accessor: "value",
                width: 252,
                headerStyle: { textAlign: "left" },
                Cell: this.renderWithIcon.bind(this),
              },
            ]}
          />,
        ]}
      />
    );
  }
}

export default ServerDetailsDialog;
