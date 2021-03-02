/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import React from "react";
import ToolbarButton from "./ToolbarButton";
import MarxanDialog from "./MarxanDialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import { faEraser } from "@fortawesome/free-solid-svg-icons";
import Sync from "material-ui/svg-icons/notification/sync";
import MarxanTable from "./MarxanTable";

class RunLogDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchText: "", selectedRun: undefined, runningJobs: false };
  }
  componentDidUpdate(prevProps, prevState) {
    //if this browser isnt running a marxan job (i.e. this.props.preprocessing === false) but there are jobs which are running then we still want to be able to stop those jobs - here we set a flag to allow the STOP button to be enabled even if this.props.preprocessing === false
    if (this.props.runLogs !== prevProps.runLogs) {
      //see of any of the run logs are running
      let runningLogs = this.props.runLogs.filter((item) => {
        return item.status === "Running";
      });
      this.setState({ runningJobs: runningLogs.length > 0 });
    }
  }
  closeDialog() {
    this.setState({ selectedRun: undefined });
    this.props.onOk();
  }
  stopRun(evt) {
    //stop the run
    this.props.stopMarxan("m" + this.state.selectedRun.pid);
    //refresh the run log - this may be done when the process stops on the server and it sends the results back in the websocket - but in case the client is not connected to the server explicitly request it
    this.refreshRunLogs();
  }
  clearRunLogs(evt) {
    this.props.clearRunLogs();
  }
  refreshRunLogs(evt) {
    this.props.getRunLogs();
    //unselect the selected run
    this.setState({ selectedRun: undefined });
  }
  changeSelectedRun(event, run) {
    this.setState({ selectedRun: run });
  }
  renderUser(row) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#dadada",
          borderRadius: "2px",
        }}
        title={row.original.user}
      >
        {row.original.user}
      </div>
    );
  }
  renderProject(row) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#dadada",
          borderRadius: "2px",
        }}
        title={row.original.project}
      >
        {row.original.project}
      </div>
    );
  }
  renderStatus(row) {
    var icon;
    switch (row.original.status) {
      case "Completed":
        icon = (
          <FontAwesomeIcon
            icon={faCheckCircle}
            style={{ color: "green" }}
            title={"Run completed"}
          />
        );
        break;
      case "Stopped":
        icon = (
          <FontAwesomeIcon
            icon={faTimesCircle}
            style={{ color: "darkgray" }}
            title={"Run stopped by the user"}
          />
        );
        break;
      case "Killed":
        icon = (
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            style={{ color: "red" }}
            title={"Run stopped by the operating system"}
          />
        );
        break;
      case "Running":
        icon = (
          <Sync
            className="spin"
            style={{
              height: "16px",
              width: "16px",
              verticalAlign: "sub",
              color: "rgb(255, 64, 129)",
            }}
          />
        );
        break;
      default:
        break;
    }
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#dadada",
          borderRadius: "2px",
        }}
        title={row.original.status}
      >
        {icon}
        {"  " + row.original.status}
      </div>
    );
  }
  renderEnded(row) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#dadada",
          borderRadius: "2px",
        }}
      >
        {row.original.endtime ? row.original.endtime : ""}
      </div>
    );
  }
  renderRuntime(row) {
    if (row.original.runtime) {
      let s = Number(
        row.original.runtime.substr(0, row.original.runtime.length - 1)
      );
      let mins = Math.floor(s / 60);
      let secs = (s % 60) + "s";
      let runTimeFormatted = mins !== 0 ? mins + "m " + secs : secs;
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#dadada",
            borderRadius: "2px",
          }}
        >
          {runTimeFormatted}
        </div>
      );
    } else {
      return "";
    }
  }
  searchTextChanged(value) {
    this.setState({ searchText: value });
  }
  render() {
    let tableColumns = [];
    tableColumns = [
      {
        Header: "pid",
        accessor: "pid",
        width: 60,
        headerStyle: { textAlign: "left" },
      },
      {
        Header: "User",
        accessor: "user",
        width: 60,
        headerStyle: { textAlign: "left" },
        Cell: this.renderUser.bind(this),
      },
      {
        Header: "Project",
        accessor: "project",
        width: 150,
        headerStyle: { textAlign: "left" },
        Cell: this.renderProject.bind(this),
      },
      {
        Header: "Started",
        accessor: "starttime",
        width: 112,
        headerStyle: { textAlign: "left" },
      },
      {
        Header: "Ended",
        accessor: "endtime",
        width: 112,
        headerStyle: { textAlign: "left" },
        Cell: this.renderEnded.bind(this),
      },
      {
        Header: "Runtime",
        accessor: "runtime",
        width: 60,
        headerStyle: { textAlign: "right" },
        className: "table_column_right_align",
        Cell: this.renderRuntime.bind(this),
      },
      {
        Header: "Runs",
        accessor: "runs",
        width: 60,
        headerStyle: { textAlign: "right" },
        className: "table_column_right_align",
      },
      {
        Header: "Status",
        accessor: "status",
        width: 80,
        headerStyle: { textAlign: "left" },
        Cell: this.renderStatus.bind(this),
      },
    ];
    return (
      <MarxanDialog
        {...this.props}
        // titleBarIcon={faBookOpen}
        onOk={this.closeDialog.bind(this)}
        onCancel={this.closeDialog.bind(this)}
        showCancelButton={false}
        helpLink={"user.html#the-run-log"}
        autoDetectWindowHeight={false}
        bodyStyle={{ padding: "0px 24px 0px 24px" }}
        title="Runs"
        showSearchBox={true}
        searchTextChanged={this.searchTextChanged.bind(this)}
        children={
          <React.Fragment key="k2">
            <div id="projectsTable">
              <MarxanTable
                data={this.props.runLogs}
                columns={tableColumns}
                searchColumns={["user", "project", "status", "runs", "runtime"]}
                searchText={this.state.searchText}
                selectedRun={this.state.selectedRun}
                changeSelectedRun={this.changeSelectedRun.bind(this)}
                getTrProps={(state, rowInfo, column) => {
                  return {
                    style: {
                      background:
                        rowInfo.original.pid ===
                        (state.selectedRun && state.selectedRun.pid)
                          ? "aliceblue"
                          : "",
                    },
                    onClick: (e) => {
                      state.changeSelectedRun(e, rowInfo.original);
                    },
                  };
                }}
              />
            </div>
            <div
              id="projectsToolbar"
              style={{
                display: this.props.userRole !== "Admin" ? "none" : "block",
              }}
            >
              <ToolbarButton
                show={!this.props.unauthorisedMethods.includes("stopMarxan")}
                title="Stop run"
                disabled={
                  this.state.selectedRun === undefined
                    ? true
                    : !this.props.preprocessing && !this.state.runningJobs
                    ? true
                    : this.state.selectedRun.status !== "Running"
                }
                onClick={this.stopRun.bind(this)}
                label={"Stop"}
                secondary={true}
              />
              <ToolbarButton
                show={!this.props.unauthorisedMethods.includes("getRunLogs")}
                title="Refresh run logs"
                icon={<FontAwesomeIcon icon={faRedoAlt} />}
                onClick={this.refreshRunLogs.bind(this)}
              />
              <ToolbarButton
                show={!this.props.unauthorisedMethods.includes("clearRunLogs")}
                title="Clear run logs"
                icon={<FontAwesomeIcon icon={faEraser} />}
                onClick={this.clearRunLogs.bind(this)}
              />
            </div>
          </React.Fragment>
        }
      />
    ); //return
  }
}

export default RunLogDialog;
