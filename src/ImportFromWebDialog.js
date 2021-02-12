/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
/*global fetch*/
/*global DOMParser*/
import * as React from "react";
import MarxanDialog from "./MarxanDialog";
import MarxanTextField from "./MarxanTextField";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import ToolbarButton from "./ToolbarButton";
import Checkbox from "material-ui/Checkbox";

let INITIAL_STATE = {
  steps: ["type", "endpoint", "layer", "metadata"],
  stepIndex: 0,
  name: "",
  description: "",
  sourceType: "",
  endpoint: "",
  srs: "",
  featureTypes: [],
  featureType: "",
  validendpoint: true,
  loading: false,
};
let SOURCE_TYPES = ["Web Feature Service"];

class ImportFromWebDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }
  handleNext() {
    const { stepIndex } = this.state;
    switch (stepIndex) {
      case this.state.steps.length - 1:
        this.importFeatures();
        break;
      default:
        this.setState({ stepIndex: stepIndex + 1 });
    }
  }
  handlePrev() {
    const { stepIndex } = this.state;
    this.setState({ stepIndex: stepIndex - 1 });
  }
  changeSourceType(event, index) {
    this.setState({ sourceType: SOURCE_TYPES[index] });
  }
  //loads an WFS getcapabilities endpoint
  getCapabilities(endpoint) {
    return new Promise((resolve, reject) => {
      //must start with http
      if (endpoint.substr(0, 4) !== "http") {
        reject("Invalid endpoint");
        return;
      }
      //fetch the data
      fetch(endpoint)
        .then((response) => {
          response.text().then((xml) => {
            //return the xml
            resolve(xml);
          });
        })
        .catch((error) => {
          //reject any errors in the call
          reject(error);
        });
    });
  }
  //when the user changes the wfs endpoint
  changeEndpoint(event, newValue) {
    this.setState({ endpoint: newValue, loading: true, validendpoint: true });
    //load the GetCapabilities XML
    this.getCapabilities(newValue)
      .then((response) => {
        this.setState({ loading: false, validendpoint: true });
        //parse the reponse as an xml document
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(response, "text/xml");
        //get the required info from the getcapabilities data
        this.getWFSInfo(xmlDoc);
      })
      .catch((err) => {
        this.setState({ loading: false, validendpoint: false });
        console.log(err);
      });
  }
  //retrieves information from the WFS getcapabilities data
  getWFSInfo(xmlDoc) {
    //get the feature types
    let featureTypesElements = xmlDoc.getElementsByTagName("wfs:FeatureType");
    //initialise the feature names array
    let featureTypes = [];
    //get the feature types (i.e. names)
    for (let item of featureTypesElements) {
      featureTypes.push(item.getElementsByTagName("wfs:Name")[0].textContent);
    }
    //get the spatial reference system - in WFS it is encoded as 'urn:ogc:def:crs:EPSG::3857'
    let srs =
      "EPSG:" +
      xmlDoc.getElementsByTagName("wfs:DefaultCRS")[0].textContent.substr(-4);
    this.setState({ featureTypes: featureTypes, srs: srs });
  }
  changeFeatureType(event, newValue) {
    this.setState({ featureType: this.state.featureTypes[newValue] });
  }
  changeName(event, newValue) {
    this.setState({ name: newValue });
  }
  changeDescription(event, newValue) {
    this.setState({ description: newValue });
  }
  importFeatures() {
    //remove the &request=getCapabilities from the endpoint
    let getFeatureEndpoint = this.state.endpoint.substr(
      0,
      this.state.endpoint.indexOf("request") - 1
    );
    this.props
      .importFeatures(
        this.state.name,
        this.state.description,
        getFeatureEndpoint,
        this.state.srs,
        this.state.featureType
      )
      .then((response) => {
        this.closeDialog();
      })
      .catch((error) => {
        this.closeDialog();
      });
  }
  closeDialog() {
    this.setState(INITIAL_STATE);
    this.props.onCancel({ importFromWebDialogOpen: false });
  }
  render() {
    let _disabled = false;
    const { stepIndex } = this.state;
    const contentStyle = { margin: "0 16px" };
    //get the disabled state for the next/finish button
    switch (stepIndex) {
      case 0:
        _disabled = this.state.sourceType === "";
        break;
      case 1:
        _disabled =
          !this.state.validendpoint ||
          this.state.endpoint === "" ||
          this.state.loading;
        break;
      case 2:
        _disabled = this.state.featureType === "";
        break;
      case 3:
        _disabled = this.state.name === "" || this.state.description === "";
        break;
      default:
      // code
    }
    const actions = [
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          margin: "auto",
          textAlign: "center",
        }}
      >
        <div style={contentStyle}>
          <div style={{ marginTop: 12 }}>
            <ToolbarButton
              label="Back"
              disabled={stepIndex === 0 || this.props.loading}
              onClick={this.handlePrev.bind(this)}
            />
            <ToolbarButton
              label={
                stepIndex === this.state.steps.length - 1 ? "Finish" : "Next"
              }
              onClick={this.handleNext.bind(this)}
              disabled={_disabled || this.props.loading}
              primary={true}
            />
          </div>
        </div>
      </div>,
    ];
    let children = (
      <div key="k28">
        {stepIndex === 0 ? (
          <div>
            <SelectField
              menuItemStyle={{ fontSize: "12px" }}
              labelStyle={{ fontSize: "12px" }}
              onChange={this.changeSourceType.bind(this)}
              value={this.state.sourceType}
              floatingLabelText="Select source type"
              floatingLabelFixed={true}
            >
              {SOURCE_TYPES.map((item) => {
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
          </div>
        ) : null}
        {stepIndex === 1 ? (
          <div>
            <MarxanTextField
              style={{ width: "330px" }}
              value={this.state.endpoint}
              errorText={this.state.validendpoint ? "" : "Invalid WFS endpoint"}
              onChange={this.changeEndpoint.bind(this)}
              floatingLabelText="Enter the WFS endpoint"
            />
          </div>
        ) : null}
        {stepIndex === 2 ? (
          <div>
            <SelectField
              menuItemStyle={{ fontSize: "12px" }}
              autoWidth={true}
              labelStyle={{ fontSize: "12px" }}
              onChange={this.changeFeatureType.bind(this)}
              value={this.state.featureType}
              floatingLabelText="Select feature type"
              floatingLabelFixed={true}
            >
              {this.state.featureTypes.map((item) => {
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
          </div>
        ) : null}
        {stepIndex === 3 ? (
          <div>
            <MarxanTextField
              value={this.state.name}
              onChange={this.changeName.bind(this)}
              floatingLabelText="Enter a name"
            />
            <MarxanTextField
              value={this.state.description}
              onChange={this.changeDescription.bind(this)}
              multiLine={true}
              rows={2}
              floatingLabelText="Enter a description"
            />
            <Checkbox
              label="Add to project"
              style={{
                fontSize: "12px",
                width: "200px",
                display: "inline-block",
                marginTop: "10px",
              }}
              onCheck={this.props.setAddToProject}
              checked={this.props.addToProject}
            />
          </div>
        ) : null}
      </div>
    );
    return (
      <MarxanDialog
        {...this.props}
        onOk={this.closeDialog.bind(this)}
        okLabel={"Cancel"}
        loading={this.props.loading || this.state.loading}
        contentWidth={390}
        title={"Import from web"}
        children={children}
        actions={actions}
        onRequestClose={this.closeDialog.bind(this)}
        helpLink={"user.html#importing-from-the-web"}
      />
    );
  }
}

export default ImportFromWebDialog;
