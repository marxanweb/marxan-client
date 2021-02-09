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
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
// import { faSync } from '@fortawesome/free-solid-svg-icons';
import Import from "material-ui/svg-icons/action/get-app";
import ToolbarButton from "./ToolbarButton";
import MarxanDialog from "./MarxanDialog";
import MarxanTable from "./MarxanTable";
import Popover from "material-ui/Popover";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import TableRow from "./TableRow.js";
//import gbif_logo from './gbif.jpg';
//import FontIcon from 'material-ui/FontIcon';
// add this to the gbif item: leftIcon={<FontIcon className="gbifLogo"/>

class FeaturesDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFeature: undefined,
      previousRow: undefined,
      searchText: "",
    };
    //initialise the filteredRows variable
    this.filteredRows = [];
  }
  _delete() {
    this.props.deleteFeature(this.state.selectedFeature);
    this.setState({ selectedFeature: undefined });
  }
  showNewFeaturePopover(event) {
    this.setState({ newFeatureAnchor: event.currentTarget });
    this.props.showNewFeaturePopover();
  }
  showImportFeaturePopover(event) {
    this.setState({ importFeatureAnchor: event.currentTarget });
    this.props.showImportFeaturePopover();
  }
  _openImportFeaturesDialog() {
    //close the dialog
    this.props.onCancel();
    //show the new feature dialog
    this.props.openImportFeaturesDialog("import");
  }
  _openImportFromWebDialog() {
    //close the dialog
    this.props.onCancel();
    //show the new feature dialog
    this.props.openImportFromWebDialog();
  }
  _newByDigitising() {
    //hide this dialog
    this.onOk();
    //show the drawing controls
    this.props.initialiseDigitising();
  }
  openImportGBIFDialog() {
    this.props.openImportGBIFDialog();
    this.props.onCancel();
  }
  clickFeature(event, rowInfo) {
    //if adding or removing features from a project
    if (this.props.addingRemovingFeatures) {
      //if the shift key is pressed then select/deselect the features in between
      if (event.shiftKey) {
        //get the selected feature ids
        let selectedIds = this.getFeaturesBetweenRows(
          this.state.previousRow,
          rowInfo
        );
        //update the selected ids
        this.props.selectFeatures(selectedIds);
      } else {
        //single feature has been clicked
        this.props.clickFeature(
          rowInfo.original,
          event.shiftKey,
          this.state.previousRow
        );
      }
      this.setState({ previousRow: rowInfo });
    } else {
      this.setState({ selectedFeature: rowInfo.original });
    }
  }

  //toggles the selection state of the features between the first and last indices and returns an array of the selected featureIds
  toggleSelectionState(selectedIds, features, first, last) {
    //get the features between the first and last positions
    let spannedFeatures = features.slice(first, last);
    //iterate through them and toggle their selected state
    spannedFeatures.forEach((feature) => {
      if (selectedIds.includes(feature.id)) {
        selectedIds.splice(selectedIds.indexOf(feature.id), 1);
      } else {
        selectedIds.push(feature.id);
      }
    });
    return selectedIds;
  }
  //gets the features ids between the two passed rows and toggles their selection state
  getFeaturesBetweenRows(previousRow, thisRow) {
    let selectedIds;
    //get the index position of the previous row that was clicked
    let idx1 =
      previousRow.index < thisRow.index ? previousRow.index + 1 : thisRow.index;
    //get the index position of this row that was clicked
    let idx2 =
      previousRow.index < thisRow.index ? thisRow.index + 1 : previousRow.index;
    //toggle the selected features depending on if the current features are filtered
    if (this.filteredRows.length < this.props.allFeatures.length) {
      selectedIds = this.toggleSelectionState(
        this.props.selectedFeatureIds,
        this.filteredRows,
        idx1,
        idx2
      );
    } else {
      selectedIds = this.toggleSelectionState(
        this.props.selectedFeatureIds,
        this.props.allFeatures,
        idx1,
        idx2
      );
    }
    return selectedIds;
  }
  //selects all feature depending on whether the data is filtered or not
  selectAllFeatures() {
    let selectedIds = [];
    //if the table is filtered then select only the filtered rows
    if (this.filteredRows.length < this.props.allFeatures.length) {
      this.filteredRows.forEach((feature) => {
        selectedIds.push(feature.id);
      });
      this.props.selectFeatures(selectedIds);
    } else {
      //select all features
      this.props.selectAllFeatures();
    }
  }
  onOk(evt) {
    if (this.props.addingRemovingFeatures) {
      this.props.onOk();
    } else {
      this.unselectFeature();
    }
  }
  unselectFeature(evt) {
    this.setState({
      selectedFeature: undefined,
    });
    this.props.onCancel();
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
  preview(feature_metadata) {
    this.props.previewFeature(feature_metadata);
  }
  renderTitle(row) {
    return <TableRow title={row.original.description} />;
  }
  renderSource(row) {
    return <TableRow title={row.original.source} />;
  }
  renderDate(row) {
    return (
      <TableRow
        title={row.original.creation_date}
        htmlContent={row.original.creation_date.substr(0, 8)}
      />
    );
  }
  renderCreatedBy(row) {
    return <TableRow title={row.original.created_by} />;
  }
  renderPreview(row) {
    return <TableRow title="Click to preview" htmlContent=".." />;
  }

  searchTextChanged(value) {
    this.setState({ searchText: value });
  }
  //called when the data in the marxantable is filtered
  dataFiltered(filteredRows) {
    //set the local filteredRows variable which is used to get filtered features between clicked rows
    this.filteredRows = filteredRows;
  }
  render() {
    if (this.props.allFeatures) {
      return (
        <MarxanDialog
          {...this.props}
          autoDetectWindowHeight={false}
          bodyStyle={{ padding: "0px 24px 0px 24px" }}
          title="Features"
          onOk={this.onOk.bind(this)}
          showCancelButton={this.props.addingRemovingFeatures}
          helpLink={
            this.props.addingRemovingFeatures
              ? "user.html#adding-and-removing-features"
              : "user.html#the-features-window"
          }
          showSearchBox={true}
          searchTextChanged={this.searchTextChanged.bind(this)}
          children={
            <React.Fragment key="k10">
              <div id="projectsTable">
                <MarxanTable
                  data={this.props.allFeatures}
                  searchColumns={[
                    "alias",
                    "description",
                    "source",
                    "created_by",
                  ]}
                  searchText={this.state.searchText}
                  dataFiltered={this.dataFiltered.bind(this)}
                  addingRemovingFeatures={this.props.addingRemovingFeatures}
                  selectedFeatureIds={this.props.selectedFeatureIds}
                  selectedFeature={this.state.selectedFeature}
                  clickFeature={this.clickFeature.bind(this)}
                  preview={this.preview.bind(this)}
                  columns={[
                    {
                      Header: "Name",
                      accessor: "alias",
                      width: 193,
                      headerStyle: { textAlign: "left" },
                    },
                    {
                      Header: "Description",
                      accessor: "description",
                      width: 246,
                      headerStyle: { textAlign: "left" },
                      Cell: this.renderTitle.bind(this),
                    },
                    {
                      Header: "Source",
                      accessor: "source",
                      width: 120,
                      headerStyle: { textAlign: "left" },
                      Cell: this.renderSource.bind(this),
                    },
                    {
                      Header: "Created",
                      accessor: "creation_date",
                      width: 70,
                      headerStyle: { textAlign: "left" },
                      Cell: this.renderDate.bind(this),
                      sortMethod: this.sortDate.bind(this),
                    },
                    {
                      Header: "Created by",
                      accessor: "created_by",
                      width: 70,
                      headerStyle: { textAlign: "left" },
                      Cell: this.renderCreatedBy.bind(this),
                    },
                    {
                      Header: "",
                      width: 8,
                      headerStyle: { textAlign: "center" },
                      Cell: this.renderPreview.bind(this),
                    },
                  ]}
                  getTrProps={(state, rowInfo, column) => {
                    return {
                      style: {
                        background:
                          (state.addingRemovingFeatures &&
                            state.selectedFeatureIds.includes(
                              rowInfo.original.id
                            )) ||
                          (!state.addingRemovingFeatures &&
                            state.selectedFeature &&
                            state.selectedFeature.id === rowInfo.original.id)
                            ? "aliceblue"
                            : "",
                      },
                      onClick: (e) => {
                        state.clickFeature(e, rowInfo);
                      },
                    };
                  }}
                  getTdProps={(state, rowInfo, column) => {
                    return {
                      onClick: (e) => {
                        if (column.Header === "")
                          state.preview(rowInfo.original);
                      },
                    };
                  }}
                />
              </div>
              <div id="projectsToolbar">
                <div
                  style={{
                    display: this.props.metadata.OLDVERSION ? "block" : "none",
                  }}
                  className={"tabTitle"}
                >
                  This is an imported project. Only features from this project
                  are shown.
                </div>
                <ToolbarButton
                  show={
                    this.props.userRole !== "ReadOnly" &&
                    !this.props.metadata.OLDVERSION &&
                    !this.props.addingRemovingFeatures
                  }
                  icon={<FontAwesomeIcon icon={faPlusCircle} />}
                  title="New feature"
                  disabled={this.props.loading}
                  onClick={this.showNewFeaturePopover.bind(this)}
                  label={"New"}
                />
                <Popover
                  open={this.props.newFeaturePopoverOpen}
                  anchorEl={this.state.newFeatureAnchor}
                  anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                  targetOrigin={{ horizontal: "left", vertical: "top" }}
                  onRequestClose={this.props.hideNewFeaturePopover}
                >
                  <Menu desktop={true}>
                    <MenuItem
                      primaryText="Draw on screen"
                      title="Create a new feature by digitising it on the screen"
                      onClick={this._newByDigitising.bind(this)}
                    />
                  </Menu>
                </Popover>
                <ToolbarButton
                  show={
                    !this.props.metadata.OLDVERSION &&
                    !this.props.addingRemovingFeatures &&
                    this.props.userRole !== "ReadOnly"
                  }
                  icon={<Import style={{ height: "20px", width: "20px" }} />}
                  title="Create new features from existing data"
                  disabled={this.props.loading}
                  onClick={this.showImportFeaturePopover.bind(this)}
                  label={"Import"}
                />
                <Popover
                  open={this.props.importFeaturePopoverOpen}
                  anchorEl={this.state.importFeatureAnchor}
                  anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                  targetOrigin={{ horizontal: "left", vertical: "top" }}
                  onRequestClose={this.props.hideImportFeaturePopover}
                >
                  <Menu desktop={true}>
                    <MenuItem
                      primaryText="From a shapefile"
                      title="Import one or more features from a shapefile"
                      onClick={this._openImportFeaturesDialog.bind(this)}
                    />
                    <MenuItem
                      primaryText="From the web"
                      title="Import one or more features from a web resource"
                      onClick={this._openImportFromWebDialog.bind(this)}
                    />
                    <MenuItem
                      primaryText="From the Global Biodiversity Information Facility"
                      title="The worlds largest provider of species observations"
                      onClick={this.openImportGBIFDialog.bind(this)}
                    />
                    <MenuItem
                      primaryText="From the IUCN Red List of Threatened Species"
                      disabled={true}
                    />
                  </Menu>
                </Popover>
                <ToolbarButton
                  show={
                    this.props.userRole === "Admin" &&
                    !this.props.metadata.OLDVERSION &&
                    !this.props.addingRemovingFeatures
                  }
                  icon={
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      color="rgb(255, 64, 129)"
                    />
                  }
                  title="Delete feature"
                  disabled={
                    this.state.selectedFeature === undefined ||
                    this.props.loading ||
                    (this.state.selectedFeature &&
                      this.state.selectedFeature.created_by === "global admin")
                  }
                  onClick={this._delete.bind(this)}
                  label={"Delete"}
                />
                {/*<ToolbarButton  
            								show={(this.props.marxanServer&&this.props.marxanServer.system !== "Windows")&&(!this.props.addingRemovingFeatures)}
            								icon={<FontAwesomeIcon icon={faSync} color='rgb(51, 153, 51)'/>} 
            								title="Refresh features" 
            								disabled={this.props.loading}
            								label={"Refresh"}
            								onClick={ this.props.refreshFeatures }
            							/>*/}
                <ToolbarButton
                  show={this.props.addingRemovingFeatures}
                  icon={<FontAwesomeIcon icon={faCircle} />}
                  title="Clear all features"
                  onClick={this.props.clearAllFeatures}
                  label={"Clear all"}
                />
                <ToolbarButton
                  show={this.props.addingRemovingFeatures}
                  icon={<FontAwesomeIcon icon={faCheckCircle} />}
                  title="Select all features"
                  onClick={this.selectAllFeatures.bind(this)}
                  label={"Select all"}
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

export default FeaturesDialog;
