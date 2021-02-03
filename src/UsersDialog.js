/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import React from "react";
// import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import ToolbarButton from "./ToolbarButton";
import MarxanDialog from "./MarxanDialog";
import MarxanTable from "./MarxanTable";
import Checkbox from "material-ui/Checkbox";

let USER_ROLES = ["User", "ReadOnly", "Admin"];
class UsersDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchText: "", selectedUser: undefined };
  }
  changeRole(user, oldRole, evt, key, newRole) {
    this.props.changeRole(user, newRole);
  }
  _delete() {
    this.props.deleteUser(this.state.selectedUser.user);
    this.setState({ selectedUser: false });
  }
  changeUser(event, user) {
    this.setState({ selectedUser: user });
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
  closeDialog() {
    this.setState({ selectedUser: undefined });
    this.props.onOk();
  }
  searchTextChanged(value) {
    this.setState({ searchText: value });
  }
  render() {
    if (this.props.users) {
      return (
        <MarxanDialog
          {...this.props}
          onOk={this.closeDialog.bind(this)}
          onRequestClose={this.closeDialog.bind(this)}
          showCancelButton={false}
          helpLink={"user.html#the-users-window-admin-users-only"}
          autoDetectWindowHeight={false}
          bodyStyle={{ padding: "0px 24px 0px 24px" }}
          title="Users"
          showSearchBox={true}
          searchTextChanged={this.searchTextChanged.bind(this)}
          children={
            <React.Fragment key="k2">
              <div id="usersTable">
                {this.props.users && this.props.users.length > 0 ? (
                  <MarxanTable
                    data={this.props.users}
                    selectedUser={this.state.selectedUser}
                    searchColumns={["user", "NAME", "EMAIL", "ROLE"]}
                    searchText={this.state.searchText}
                    changeUser={this.changeUser.bind(this)}
                    columns={[
                      {
                        Header: "User",
                        accessor: "user",
                        width: 90,
                        headerStyle: { textAlign: "left" },
                      },
                      {
                        Header: "Name",
                        accessor: "NAME",
                        width: 173,
                        headerStyle: { textAlign: "left" },
                      },
                      {
                        Header: "email",
                        accessor: "EMAIL",
                        width: 135,
                        headerStyle: { textAlign: "left" },
                      },
                      {
                        Header: "Role",
                        accessor: "ROLE",
                        width: 180,
                        headerStyle: { textAlign: "left" },
                        Cell: (row) =>
                          row.original.user === "guest" ? (
                            <div>ReadOnly</div>
                          ) : (
                            <SelectField
                              style={{
                                width: 130,
                                height: 15,
                                lineHeight: 15,
                                position: "relative",
                                fontSize: "12px",
                              }}
                              menuStyle={{ position: "absolute", top: -22 }}
                              underlineStyle={{ position: "relative", top: 20 }}
                              iconStyle={{ lineHeight: "24px", height: "24px" }}
                              value={row.original.ROLE}
                              onChange={this.changeRole.bind(
                                this,
                                row.original.user,
                                row.value
                              )}
                            >
                              {USER_ROLES.map((item) => {
                                return (
                                  <MenuItem
                                    style={{ fontSize: "12px" }}
                                    value={item}
                                    primaryText={item}
                                    key={item}
                                  />
                                );
                              })}
                            </SelectField>
                          ),
                      },
                      {
                        Header: "Date",
                        accessor: "CREATEDATE",
                        width: 115,
                        headerStyle: { textAlign: "left" },
                        sortMethod: this.sortDate.bind(this),
                      },
                    ]}
                    getTrProps={(state, rowInfo, column) => {
                      return {
                        style: {
                          background:
                            rowInfo.original.user ===
                            (state.selectedUser && state.selectedUser.user)
                              ? "aliceblue"
                              : "",
                        },
                        onClick: (e) => {
                          if (USER_ROLES.indexOf(e.target.textContent) === -1)
                            state.changeUser(e, rowInfo.original);
                        },
                      };
                    }}
                  />
                ) : null}
              </div>
              <div id="projectsToolbar">
                <ToolbarButton
                  icon={
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      color="rgb(255, 64, 129)"
                    />
                  }
                  title="Delete user"
                  disabled={
                    !this.state.selectedUser ||
                    this.props.loading ||
                    this.props.user === this.state.selectedUser.user ||
                    this.state.selectedUser.user === "guest"
                  }
                  onClick={this._delete.bind(this)}
                  label={"Delete"}
                />
                <Checkbox
                  label="Enable guest user"
                  style={{
                    fontSize: "12px",
                    paddingLeft: "10px",
                    width: "200px",
                    display: "inline-block",
                    verticalAlign: "bottom",
                  }}
                  onClick={this.props.toggleEnableGuestUser}
                  checked={this.props.guestUserEnabled}
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

export default UsersDialog;
