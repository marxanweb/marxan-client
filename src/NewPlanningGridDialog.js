/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import * as React from "react";
import CONSTANTS from "./constants";
import MarxanDialog from "./MarxanDialog";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
// import ToolbarButton from "./ToolbarButton";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';

class NewPlanningGridDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iso3: "",
      domain: "",
      shape: "",
      areakm2: undefined,
      domainEnabled: true,
    };
  }
  changeIso3(evt, value) {
    let iso3 = this.props.countries[value].iso3;
    if (["FJI", "KIR", "NZL", "RUS", "TUV", "USA", "WLF"].includes(iso3)) {
      //no support currently for countries that span the meridian
      // this.setState({iso3: undefined});
      // this.props.setSnackBar("Countries that span the meridian are currently not supported. See <a href='" + CONSTANTS.ERRORS_PAGE + "#planning-grids-cannot-be-created-for-countries-that-span-the-meridian' target='blank'>here</a>");
      this.setState({ iso3: this.props.countries[value].iso3 });
    } else {
      this.setState({ iso3: this.props.countries[value].iso3 });
    }
    //set the value of the domain to terrestrial only if the country has no marine area
    if (!this.props.countries[value].has_marine) {
      this.changeDomain(null, 1);
      this.setState({ domainEnabled: false });
    } else {
      this.setState({ domainEnabled: true });
    }
  }
  changeDomain(evt, value) {
    this.setState({ domain: CONSTANTS.DOMAINS[value] });
  }
  changeShape(evt, value) {
    this.setState({ shape: CONSTANTS.SHAPES[value] });
  }
  changeAreaKm2(evt, value) {
    this.setState({ areakm2: CONSTANTS.AREAKM2S[value] });
  }
  onOk() {
    //create the new planning grid
    this.props
      .createNewPlanningUnitGrid(
        this.state.iso3,
        this.state.domain,
        this.state.areakm2,
        this.state.shape
      )
      .then(
        function (response) {
          //close the dialog
          this.props.onCancel();
        }.bind(this)
      );
  }
  render() {
    let dropDownStyle = { width: "240px" };
    return (
      <MarxanDialog
        {...this.props}
        onOk={this.onOk.bind(this)}
        onRequestClose={this.props.onCancel}
        okDisabled={
          !this.state.iso3 ||
          !this.state.domain ||
          !this.state.areakm2 ||
          this.props.loading
        }
        cancelLabel={"Cancel"}
        showCancelButton={true}
        helpLink={"user.html#creating-new-planning-grids-using-marxan-web"}
        title="New planning grid"
        contentWidth={358}
        children={
          <React.Fragment key="k13">
            <div>
              <SelectField
                menuItemStyle={{ fontSize: "12px" }}
                labelStyle={{ fontSize: "12px" }}
                onChange={this.changeIso3.bind(this)}
                value={this.state.iso3}
                floatingLabelText="Area of interest"
                floatingLabelFixed={true}
              >
                {this.props.countries.map((item) => {
                  return (
                    <MenuItem
                      style={{ fontSize: "12px" }}
                      value={item.iso3}
                      primaryText={item.name_iso31}
                      key={item.iso3}
                    />
                  );
                })}
              </SelectField>
              {/*<ToolbarButton icon={<FontAwesomeIcon icon={faArrowAltCircleUp} />} title="Load a custom area of interest from a shapefile (not currently implemented)" style={{position: 'absolute', top: '83px', right: '32px'}}/>*/}
            </div>
            <div>
              <SelectField
                menuItemStyle={{ fontSize: "12px" }}
                labelStyle={{ fontSize: "12px" }}
                onChange={this.changeDomain.bind(this)}
                value={this.state.domain}
                style={dropDownStyle}
                floatingLabelText="Domain"
                floatingLabelFixed={true}
                disabled={!this.state.domainEnabled}
              >
                {CONSTANTS.DOMAINS.map((item) => {
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
            <div>
              <SelectField
                menuItemStyle={{ fontSize: "12px" }}
                labelStyle={{ fontSize: "12px" }}
                onChange={this.changeShape.bind(this)}
                value={this.state.shape}
                style={dropDownStyle}
                floatingLabelText="Planning unit shape"
                floatingLabelFixed={true}
              >
                {CONSTANTS.SHAPES.map((item) => {
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
            <div>
              <SelectField
                menuItemStyle={{ fontSize: "12px" }}
                labelStyle={{ fontSize: "12px" }}
                onChange={this.changeAreaKm2.bind(this)}
                value={this.state.areakm2}
                style={dropDownStyle}
                floatingLabelText="Area of each planning unit"
                floatingLabelFixed={true}
              >
                {CONSTANTS.AREAKM2S.map((item) => {
                  return (
                    <MenuItem
                      style={{ fontSize: "12px" }}
                      value={item}
                      primaryText={item + " Km2"}
                      key={item}
                    />
                  );
                })}
              </SelectField>
            </div>
          </React.Fragment>
        }
      />
    );
  }
}

export default NewPlanningGridDialog;
