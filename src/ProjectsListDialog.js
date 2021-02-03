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

class ProjectsListDialog extends React.Component {
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
  render() {
    let tableColumns = [];
    if (["Admin"].includes(this.props.userRole)) {
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
      ];
    } else {
      tableColumns = [
        {
          Header: "Name",
          accessor: "name",
          width: 200,
          headerStyle: { textAlign: "left" },
          Cell: this.renderName.bind(this),
        },
      ];
    }
    if (this.props.projects) {
      return (
        <MarxanDialog
          {...this.props}
          // titleBarIcon={faBookOpen}
          showCancelButton={false}
          autoDetectWindowHeight={false}
          bodyStyle={{ padding: "0px 24px 0px 24px" }}
          title={this.props.title}
          contentWidth={500}
          helpLink={"user.html#projects-list"}
          children={
            <React.Fragment key="k24">
              <div style={{ marginBottom: "5px" }}>{this.props.heading}</div>
              <div id="failedProjectsTable">
                <ReactTable
                  pageSize={this.props.projects.length}
                  className={"projectsReactTable"}
                  showPagination={false}
                  minRows={0}
                  noDataText=""
                  data={this.props.projects}
                  thisRef={this}
                  columns={tableColumns}
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

export default ProjectsListDialog;
