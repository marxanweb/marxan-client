/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import Import from "material-ui/svg-icons/action/get-app";
import Export from "material-ui/svg-icons/editor/publish";
import Clone from "material-ui/svg-icons/content/content-copy";
import ToolbarButton from "./ToolbarButton";
import MarxanDialog from "./MarxanDialog";
import MarxanTable from "./MarxanTable";
import Popover from "material-ui/Popover";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";

class ProjectsDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchText: "", selectedProject: undefined };
  }
  _delete() {
    this.props.deleteProject(
      this.state.selectedProject.user,
      this.state.selectedProject.name
    );
    this.setState({ selectedProject: false });
  }
  load() {
    if (
      this.props.oldVersion === true &&
      this.state.selectedProject.oldVersion === false
    ) {
      //get all the features again otherwise the allFeatures state will be bound to the old versions features
      this.props.getAllFeatures().then(
        function () {
          this.loadAndClose();
        }.bind(this)
      );
    } else {
      this.loadAndClose();
    }
  }
  loadAndClose() {
    //load the project
    this.props.loadProject(
      this.state.selectedProject.name,
      this.state.selectedProject.user
    );
    this.closeDialog();
  }
  showImportProjectPopover(event) {
    this.setState({ importProjectAnchor: event.currentTarget });
    this.props.updateState({ importProjectPopoverOpen: true });
  }
  _new() {
    //get all the features again otherwise the allFeatures state may be bound to an old version of marxans features
    this.props.getAllFeatures().then(
      function () {
        this.props.updateState({ newProjectDialogOpen: true });
        this.closeDialog();
      }.bind(this)
    );
  }
  cloneProject() {
    this.props.cloneProject(
      this.state.selectedProject.user,
      this.state.selectedProject.name
    );
  }
  exportProject() {
    this.props
      .exportProject(
        this.state.selectedProject.user,
        this.state.selectedProject.name
      )
      .then((url) => {
        window.location = url;
      });
    this.closeDialog();
  }
  openImportProjectDialog() {
    this.props.updateState({ importProjectDialogOpen: true });
    this.closeDialog();
  }
  openImportMXWDialog() {
    this.props.updateState({ importMXWDialogOpen: true });
    this.closeDialog();
  }
  changeProject(event, project) {
    this.setState({ selectedProject: project });
  }
  closeDialog() {
    this.setState({ selectedProject: undefined });
    this.props.updateState({
      projectsDialogOpen: false,
      importProjectPopoverOpen: false,
    });
  }
  sortDate(a, b, desc) {
    return new Date(
      a.slice(6, 8),
      a.slice(3, 5) - 1,
      a.slice(0, 2),
      a.slice(9, 11),
      a.slice(12, 14),
      a.slice(15, 17)
    ) >
      new Date(
        b.slice(6, 8),
        b.slice(3, 5) - 1,
        b.slice(0, 2),
        b.slice(9, 11),
        b.slice(12, 14),
        b.slice(15, 17)
      )
      ? 1
      : -1;
  }
  renderDate(row) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#dadada",
          borderRadius: "2px",
        }}
        title={row.original.createdate}
      >
        {row.original.createdate.substr(0, 8)}
      </div>
    );
  }
  renderTitle(row) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#dadada",
          borderRadius: "2px",
        }}
        title={row.original.description}
      >
        {row.original.description}
      </div>
    );
  }
  renderName(row) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#dadada",
          borderRadius: "2px",
        }}
        title={row.original.name}
      >
        {row.original.name}
      </div>
    );
  }
  searchTextChanged(value) {
    this.setState({ searchText: value });
  }
  render() {
    let tableColumns = [];
    if (["Admin", "ReadOnly"].includes(this.props.userRole)) {
      tableColumns = [
        {
          Header: "User",
          accessor: "user",
          width: 90,
          headerStyle: { textAlign: "left" },
        },
        {
          Header: "Name",
          accessor: "name",
          width: 200,
          headerStyle: { textAlign: "left" },
          Cell: this.renderName.bind(this),
        },
        {
          Header: "Description",
          accessor: "description",
          width: 360,
          headerStyle: { textAlign: "left" },
          Cell: this.renderTitle.bind(this),
        },
        {
          Header: "Created",
          accessor: "createdate",
          width: 70,
          headerStyle: { textAlign: "left" },
          Cell: this.renderDate.bind(this),
          sortMethod: this.sortDate.bind(this),
        },
      ];
    } else {
      tableColumns = [
        {
          Header: "Name",
          accessor: "name",
          width: 260,
          headerStyle: { textAlign: "left" },
          Cell: this.renderName.bind(this),
        },
        {
          Header: "Description",
          accessor: "description",
          width: 390,
          headerStyle: { textAlign: "left" },
          Cell: this.renderTitle.bind(this),
        },
        {
          Header: "Created",
          accessor: "createdate",
          width: 220,
          headerStyle: { textAlign: "left" },
          Cell: this.renderDate.bind(this),
          sortMethod: this.sortDate.bind(this),
        },
      ];
    }
    if (this.props.projects) {
      return (
        <MarxanDialog
          {...this.props}
          // titleBarIcon={faBookOpen}
          okLabel={
            this.props.userRole === "ReadOnly" ? "Open (Read-only)" : "Open"
          }
          onOk={this.load.bind(this)}
          onCancel={this.closeDialog.bind(this)}
          okDisabled={!this.state.selectedProject}
          showCancelButton={true}
          helpLink={"user.html#the-projects-window"}
          autoDetectWindowHeight={false}
          bodyStyle={{ padding: "0px 24px 0px 24px" }}
          title="Projects"
          showSearchBox={true}
          searchTextChanged={this.searchTextChanged.bind(this)}
          children={
            <React.Fragment key="k2">
              <div id="projectsTable">
                <MarxanTable
                  data={this.props.projects}
                  columns={tableColumns}
                  searchColumns={["user", "name", "description"]}
                  searchText={this.state.searchText}
                  selectedProject={this.state.selectedProject}
                  changeProject={this.changeProject.bind(this)}
                  getTrProps={(state, rowInfo, column) => {
                    return {
                      style: {
                        background:
                          rowInfo.original.user ===
                            (state.selectedProject &&
                              state.selectedProject.user) &&
                          rowInfo.original.name ===
                            (state.selectedProject &&
                              state.selectedProject.name)
                            ? "aliceblue"
                            : "",
                      },
                      onClick: (e) => {
                        state.changeProject(e, rowInfo.original);
                      },
                    };
                  }}
                />
              </div>
              <div
                id="projectsToolbar"
                style={{
                  display:
                    this.props.userRole === "ReadOnly" ? "none" : "block",
                }}
              >
                <ToolbarButton
                  show={
                    !this.props.unauthorisedMethods.includes("createProject")
                  }
                  icon={<FontAwesomeIcon icon={faPlusCircle} />}
                  title="New project"
                  onClick={this._new.bind(this)}
                  label={"New"}
                />
                <ToolbarButton
                  show={!(this.props.userRole === "ReadOnly")}
                  icon={<Import style={{ height: "20px", width: "20px" }} />}
                  title="Import a project from Marxan Web or Marxan DOS"
                  onClick={this.showImportProjectPopover.bind(this)}
                  disabled={this.props.loading}
                  label={"Import"}
                />
                <Popover
                  open={this.props.importProjectPopoverOpen}
                  anchorEl={this.state.importProjectAnchor}
                  anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                  targetOrigin={{ horizontal: "left", vertical: "top" }}
                  onRequestClose={() =>
                    this.props.updateState({ importProjectPopoverOpen: false })
                  }
                >
                  <Menu desktop={true}>
                    <MenuItem
                      style={{
                        display: !this.props.unauthorisedMethods.includes(
                          "importProject"
                        )
                          ? "inline-block"
                          : "none",
                      }}
                      primaryText="From Marxan Web"
                      title="Import a project from a Marxan Web *.mxw file"
                      onClick={this.openImportMXWDialog.bind(this)}
                    />
                    <MenuItem
                      style={{
                        display: !this.props.unauthorisedMethods.includes(
                          "createImportProject"
                        )
                          ? "inline-block"
                          : "none",
                      }}
                      primaryText="From Marxan DOS"
                      title="Import a project from a Marxan DOS"
                      onClick={this.openImportProjectDialog.bind(this)}
                    />
                  </Menu>
                </Popover>
                <ToolbarButton
                  show={
                    !this.props.unauthorisedMethods.includes("exportProject")
                  }
                  icon={<Export style={{ height: "20px", width: "20px" }} />}
                  title="Export project"
                  onClick={this.exportProject.bind(this)}
                  disabled={
                    !this.state.selectedProject ||
                    this.props.loading ||
                    this.state.selectedProject.oldVersion
                  }
                  label={"Export"}
                />
                <ToolbarButton
                  show={
                    !this.props.unauthorisedMethods.includes("cloneProject")
                  }
                  icon={<Clone style={{ height: "20px", width: "20px" }} />}
                  title="Clone project"
                  onClick={this.cloneProject.bind(this)}
                  disabled={!this.state.selectedProject || this.props.loading}
                  label={"Clone"}
                />
                <ToolbarButton
                  show={
                    !this.props.unauthorisedMethods.includes("deleteProject")
                  }
                  icon={
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      color="rgb(255, 64, 129)"
                    />
                  }
                  title="Delete project"
                  disabled={!this.state.selectedProject || this.props.loading}
                  onClick={this._delete.bind(this)}
                  label={"Delete"}
                />
              </div>
            </React.Fragment>
          }
        />
      );
    } else {
      return null;
    }
  }
}

export default ProjectsDialog;
