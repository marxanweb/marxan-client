/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import React from "react";
import CONSTANTS from "./constants";
import "react-table/react-table.css";
import Paper from "material-ui/Paper";
import { Tabs, Tab } from "material-ui/Tabs";
import SelectField from "material-ui/SelectField";
import SelectFeatures from "./SelectFeatures";
import MenuItem from "material-ui/MenuItem";
import Settings from "material-ui/svg-icons/action/settings";
import ToolbarButton from "./ToolbarButton";
import Checkbox from "material-ui/Checkbox";
import Textarea from "react-textarea-autosize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { faEraser } from "@fortawesome/free-solid-svg-icons";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { faSave } from "@fortawesome/free-solid-svg-icons";
// import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

class InfoPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editingProjectName: false,
      editingDescription: false,
      showPlanningGrid: true,
      showProtectedAreas: false,
      showCosts: false,
      showStatuses: true,
    };
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    //if the input box for renaming the project has been made visible and it has no value, then initialise it with the project name and focus it
    if (
      prevState.editingProjectName === false &&
      this.state.editingProjectName
    ) {
      document.getElementById("projectName").value = this.props.project;
      document.getElementById("projectName").focus();
    }
    //if the input box for renaming the description has been made visible and it has no value, then initialise it with the description and focus it
    if (
      prevState.editingDescription === false &&
      this.state.editingDescription
    ) {
      document.getElementById(
        "descriptionEdit"
      ).value = this.props.metadata.DESCRIPTION;
      document.getElementById("descriptionEdit").focus();
    }
  }

  onKeyPress(e) {
    if (e.nativeEvent.keyCode === 13 || e.nativeEvent.keyCode === 27) {
      document.getElementById(e.nativeEvent.target.id).blur(); //call the onBlur event which will call the REST service to rename the project
    }
  }

  onBlur(e) {
    if (e.nativeEvent.target.id === "projectName") {
      this.props.renameProject(e.target.value).then(() => {
        this.setState({ editingProjectName: false });
      });
    } else {
      this.props.renameDescription(e.target.value).then(() => {
        this.setState({ editingDescription: false });
      });
    }
  }

  startEditingProjectName() {
    if (this.props.project) {
      //a project may not be loaded
      this.setState({ editingProjectName: true });
    }
  }
  startEditingDescription() {
    if (this.props.project) {
      //a project may not be loaded
      this.setState({ editingDescription: true });
    }
  }
  startStopPuEditSession(evt) {
    this.props.puEditing ? this.stopPuEditSession() : this.startPuEditSession();
  }
  startPuEditSession() {
    this.setState({ puEditing: true });
    this.props.startPuEditSession();
  }

  stopPuEditSession() {
    this.setState({ puEditing: false });
    this.props.stopPuEditSession();
  }

  changeIucnCategory(event, key, payload) {
    this.props.changeIucnCategory(CONSTANTS.IUCN_CATEGORIES[key]);
  }
  changeCostname(event, key, payload) {
    //get the costname
    let costname = this.costnames[key];
    if (costname === "Custom..") {
      this.props.updateState({ costsDialogOpen: true });
    } else {
      //update the cost profile on the server
      this.props.changeCostname(costname).then((_) => {
        //load the costs
        this.props.loadCostsLayer(true);
      });
    }
  }
  toggleProjectPrivacy(evt, isInputChecked) {
    let checkedString = isInputChecked ? "True" : "False";
    this.props.toggleProjectPrivacy(checkedString);
  }
  stopProcess() {
    this.props.stopProcess(this.props.pid);
  }
  togglePlanningUnits(event, isInputChecked) {
    //toggles the visibility of the planning grid
    this.setState({ showPlanningGrid: !this.state.showPlanningGrid });
    this.props.togglePULayer(isInputChecked);
  }
  toggleProtectedAreas(event, isInputChecked) {
    //toggles the visibility of the protected areas
    this.setState({ showProtectedAreas: !this.state.showProtectedAreas });
    this.props.togglePALayer(isInputChecked);
  }
  toggleCosts(event, isInputChecked) {
    //toggles the visibility of the costs
    this.setState({ showCosts: !this.state.showCosts });
    this.props.toggleCostsLayer(isInputChecked);
  }
  toggleStatuses(event, isInputChecked) {
    //toggles the visibility of the statuses
    this.setState({ showStatuses: !this.state.showStatuses });
    this.props.toggleStatuses(isInputChecked);
  }
  render() {
    this.costnames = [];
    //add a custom item to the end of the cost profiles
    if (this.props.costnames) {
      this.costnames = this.props.costnames.slice();
      this.costnames.push("Custom..");
    }
    return (
      <React.Fragment>
        <div
          className={"infoPanel"}
          style={{ display: this.props.open ? "block" : "none" }}
        >
          <Paper zDepth={2} className="InfoPanelPaper">
            <Paper zDepth={2} className="titleBar">
              {this.props.userRole === "ReadOnly" ? (
                <span
                  className={"projectNameEditBox"}
                  title={this.props.project + " (Read-only)"}
                >
                  <FontAwesomeIcon
                    style={{
                      color: "white",
                      height: "16px",
                      marginTop: "4px",
                      marginBottom: "2px",
                      marginRight: "5px",
                    }}
                    icon={faLock}
                  />
                  {this.props.project}
                </span>
              ) : (
                <span
                  onClick={this.startEditingProjectName.bind(this)}
                  className={"projectNameEditBox"}
                  title="Click to rename the project"
                >
                  {this.props.project}
                </span>
              )}
              {this.props.userRole === "ReadOnly" ? null : (
                <input
                  id="projectName"
                  style={{
                    position: "absolute",
                    display: this.state.editingProjectName ? "block" : "none",
                    left: "39px",
                    top: "32px",
                    width: "365px",
                    border: "1px lightgray solid",
                  }}
                  className={"projectNameEditBox"}
                  onKeyPress={this.onKeyPress.bind(this)}
                  onBlur={this.onBlur.bind(this)}
                />
              )}
            </Paper>
            <Tabs
              contentContainerStyle={{ margin: "20px" }}
              className={"tabs"}
              value={this.props.activeTab}
              style={{
                backgroundColor: this.state.puEditing ? "#eee" : "unset",
              }}
            >
              <Tab
                label="Project"
                onActive={this.props.project_tab_active}
                value="project"
                disabled={this.props.puEditing ? true : false}
              >
                <div>
                  <div className={"tabTitle"}>Description</div>
                  {this.props.userRole === "ReadOnly" ? null : (
                    <Textarea
                      minRows={5}
                      id="descriptionEdit"
                      style={{
                        display: this.state.editingDescription
                          ? "block"
                          : "none",
                      }}
                      className={"descriptionEditBox"}
                      onKeyPress={this.onKeyPress.bind(this)}
                      onBlur={this.onBlur.bind(this)}
                    />
                  )}
                  {this.props.userRole === "ReadOnly" ? (
                    <div
                      className={"description"}
                      title={this.props.metadata.DESCRIPTION}
                      dangerouslySetInnerHTML={{
                        __html: this.props.metadata.DESCRIPTION,
                      }}
                    />
                  ) : (
                    <div
                      className={"description"}
                      onClick={this.startEditingDescription.bind(this)}
                      style={{
                        display: !this.state.editingDescription
                          ? "block"
                          : "none",
                      }}
                      title="Click to edit"
                      dangerouslySetInnerHTML={{
                        __html: this.props.metadata.DESCRIPTION,
                      }}
                    />
                  )}
                  <div className={"tabTitle tabTitleTopMargin"}>Created</div>
                  <div className={"createDate"}>
                    {this.props.metadata.CREATEDATE}
                  </div>
                  <div
                    style={{
                      display:
                        this.props.user !== this.props.owner ? "block" : "none",
                    }}
                  >
                    <div className={"tabTitle tabTitleTopMargin"}>
                      Created by
                    </div>
                    <div className={"createDate"}>{this.props.owner}</div>
                  </div>
                  <div className={"tabTitle tabTitleTopMargin"}>
                    {this.props.metadata.OLDVERSION ? "Imported project" : ""}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "413px",
                      display:
                        this.props.userRole === "ReadOnly" ? "none" : "block",
                    }}
                  >
                    <Checkbox
                      label="Private"
                      style={{ fontSize: "12px" }}
                      checked={this.props.metadata.PRIVATE}
                      onCheck={this.toggleProjectPrivacy.bind(this)}
                    />
                  </div>
                </div>
              </Tab>
              <Tab
                label="Features"
                onActive={this.props.features_tab_active}
                value="features"
                disabled={this.props.puEditing ? true : false}
              >
                <SelectFeatures
                  features={this.props.features}
                  openFeatureMenu={this.props.openFeatureMenu}
                  openFeaturesDialog={this.props.openFeaturesDialog}
                  metadata={this.props.metadata}
                  updateFeature={this.props.updateFeature}
                  leftmargin={"10px"}
                  maxheight={"409px"}
                  simple={false}
                  showTargetButton={true}
                  openTargetDialog={this.props.openTargetDialog}
                  userRole={this.props.userRole}
                  toggleFeatureLayer={this.props.toggleFeatureLayer}
                  toggleFeaturePUIDLayer={this.props.toggleFeaturePUIDLayer}
                  useFeatureColors={this.props.useFeatureColors}
                  smallLinearGauge={this.props.smallLinearGauge}
                />
              </Tab>
              <Tab
                label="Planning units"
                onActive={this.props.pu_tab_active}
                value="planning_units"
              >
                <div>
                  <div>
                    <div className={"tabTitle tabTitleInlineBlock"}>
                      Planning Grid
                    </div>
                  </div>
                  <div className={"description"}>
                    {this.props.metadata.pu_alias}
                  </div>
                  <div>
                    <div className={"tabTitle tabTitleTopMargin"}>Statuses</div>
                  </div>
                  <div
                    style={{
                      display:
                        this.props.userRole === "ReadOnly" ? "none" : "block",
                    }}
                  >
                    <div className={"puManualEditContainer"}>
                      <FontAwesomeIcon
                        icon={this.props.puEditing ? faSave : faLock}
                        onClick={this.startStopPuEditSession.bind(this)}
                        title={this.props.puEditing ? "Save" : "Manually edit"}
                        style={{
                          cursor: "pointer",
                          marginLeft: "3px",
                          marginRight: "10px",
                          color: "rgba(255, 64, 129, 0.7)",
                        }}
                      />
                      <div
                        style={{
                          display: this.props.puEditing
                            ? "inline-block"
                            : "none",
                        }}
                        className={"puManualEditClear"}
                      >
                        <FontAwesomeIcon
                          icon={faEraser}
                          onClick={this.props.clearManualEdits.bind(this)}
                          title={"Clear all manual edits"}
                          style={{
                            cursor: "pointer",
                            color: "rgba(255, 64, 129, 0.7)",
                          }}
                        />
                      </div>
                      <div
                        className={"description"}
                        style={{
                          display: "inline-block",
                          fontSize: "12px",
                          paddingLeft: "7px",
                        }}
                      >
                        {this.props.puEditing
                          ? "Click on the map to change the status"
                          : "Manually edit"}
                      </div>
                    </div>
                  </div>
                  <SelectField
                    floatingLabelText={"Lock in protected areas"}
                    floatingLabelFixed={true}
                    underlineShow={false}
                    disabled={
                      this.props.preprocessing ||
                      this.props.userRole === "ReadOnly"
                    }
                    menuItemStyle={{ fontSize: "12px" }}
                    labelStyle={{ fontSize: "12px" }}
                    style={{ marginTop: "-14px", width: "180px" }}
                    value={this.props.metadata.IUCN_CATEGORY}
                    onChange={this.changeIucnCategory.bind(this)}
                    children={CONSTANTS.IUCN_CATEGORIES.map((item) => {
                      return (
                        <MenuItem
                          value={item}
                          key={item}
                          primaryText={item}
                          style={{ fontSize: "12px" }}
                        />
                      );
                    })}
                  />
                  {/*<FontAwesomeIcon icon={faExclamationTriangle} style={{color:'red', display:(this.props.metadata.IUCN_CATEGORY!=='None' && this.props.protected_area_intersections && this.props.protected_area_intersections.length===0) ? 'inline' : 'none', position:'absolute'}} title={'Protected areas have been updated since you locked these ones in'}/>*/}
                  <div>
                    <div className={"tabTitle"}>Costs</div>
                  </div>
                  <SelectField
                    floatingLabelText={"Use cost surface"}
                    floatingLabelFixed={true}
                    underlineShow={false}
                    disabled={
                      this.props.preprocessing ||
                      this.props.userRole === "ReadOnly"
                    }
                    menuItemStyle={{ fontSize: "12px" }}
                    labelStyle={{ fontSize: "12px" }}
                    style={{ marginTop: "-14px", width: "230px" }}
                    value={this.props.costname}
                    onChange={this.changeCostname.bind(this)}
                    children={this.costnames.map((item) => {
                      return (
                        <MenuItem
                          value={item}
                          key={item}
                          primaryText={item}
                          style={{ fontSize: "12px" }}
                        />
                      );
                    })}
                  />
                </div>
              </Tab>
            </Tabs>
            <Paper className={"lowerToolbar"}>
              <ToolbarButton
                icon={<FontAwesomeIcon icon={faShareAlt} />}
                title={"Get a shareable link to this project"}
                onClick={this.props.getShareableLink}
                show={this.props.marxanServer.type === "remote"}
              />
              <ToolbarButton
                icon={<Settings style={{ height: "20px", width: "20px" }} />}
                title="Run Settings"
                onClick={() =>
                  this.props.updateState({ settingsDialogOpen: true })
                }
              />
              <div className="toolbarSpacer" />
              <ToolbarButton
                label="Stop"
                title="Click to stop the current run"
                show={this.props.userRole !== "ReadOnly"}
                style={{ marginLeft: "194px" }}
                onClick={this.stopProcess.bind(this)}
                disabled={this.props.pid === 0}
                secondary={true}
              />
              <ToolbarButton
                label="Run"
                title="Click to run this project"
                show={this.props.userRole !== "ReadOnly"}
                onClick={this.props.runMarxan}
                disabled={
                  this.props.preprocessing ||
                  this.props.features.length === 0 ||
                  this.props.puEditing
                }
                secondary={true}
              />
            </Paper>
          </Paper>
        </div>
      </React.Fragment>
    );
  }
}

export default InfoPanel;
