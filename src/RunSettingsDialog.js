/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import React from "react";
import "react-table/react-table.css";
import ReactTable from "react-table";
import FontAwesome from "react-fontawesome";
import MarxanDialog from "./MarxanDialog";

class RunSettingsDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], updateEnabled: false };
    this.renderEditable = this.renderEditable.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.runParams !== this.props.runParams) {
      this.setState({ data: this.props.runParams });
    }
  }
  openParametersDialog() {
    this.props.openParametersDialog();
  }
  //posts the results back to the server
  updateRunParams() {
    //ui feedback
    this.setState({ updateEnabled: false });
    if (this.props.userRole !== "ReadOnly")
      this.props.updateRunParams(this.state.data);
    this.props.onOk();
  }
  setUpdateEnabled() {
    this.setState({ updateEnabled: true });
  }
  renderEditable(cellInfo) {
    return this.props.userRole === "ReadOnly" ? (
      <React.Fragment>
        <div>{this.state.data[cellInfo.index]["value"]}</div>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <div
          style={{
            backgroundColor: "#fafafa",
            float:
              [...this.state.data][cellInfo.index]["key"] === "BLM"
                ? "left"
                : "none",
          }}
          contentEditable
          suppressContentEditableWarning
          onFocus={this.setUpdateEnabled.bind(this)}
          onBlur={(e) => {
            const data = [...this.state.data];
            data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
            this.setState({ data });
          }}
        >
          {this.state.data[cellInfo.index]["value"]}
        </div>
        <FontAwesome
          name="external-link-alt"
          onClick={this.props.showClumpingDialog}
          title="Click to open the BLM comparison dialog"
          style={{
            display:
              [...this.state.data][cellInfo.index]["key"] === "BLM"
                ? "block"
                : "none",
            cursor: "pointer",
            paddingTop: "6px",
            paddingLeft: "35px",
          }}
        />
      </React.Fragment>
    );
  }
  render() {
    return (
      <MarxanDialog
        {...this.props}
        contentWidth={400}
        offsetX={80}
        offsetY={260}
        onOk={this.updateRunParams.bind(this)}
        helpLink={"user.html#run-settings"}
        title="Run settings"
        children={
          <div style={{ height: "275px" }} key="k16">
            <ReactTable
              showPagination={false}
              className={"summary_infoTable"}
              minRows={0}
              pageSize={this.state.data.length}
              data={this.state.data}
              noDataText=""
              columns={[
                {
                  Header: "Parameter",
                  accessor: "key",
                  width: 165,
                  headerStyle: { textAlign: "left" },
                },
                {
                  Header: "Value",
                  accessor: "value",
                  width: 193,
                  headerStyle: { textAlign: "left" },
                  Cell: this.renderEditable,
                },
              ]}
            />
          </div>
        }
      />
    );
  }
}

export default RunSettingsDialog;
