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
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton";

class UserSettingsDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = { saveEnabled: false };
    this.options = {};
  }
  setOption(key, value) {
    this.setState({ saveEnabled: true });
    this.options[key] = value;
    this.props.saveOptions(this.options);
  }
  updateOptions() {
    this.props.onOk();
  }
  changeBasemap(event, key, payload) {
    var basemap = this.props.basemaps[key];
    this.props.changeBasemap(basemap);
    this.setOption("BASEMAP", basemap.name);
  }
  toggleUseFeatureColors(evt, isInputChecked) {
    this.setOption("USEFEATURECOLORS", isInputChecked);
  }
  toggleShowWelcomeScreen(evt, isInputChecked) {
    this.setOption("SHOWWELCOMESCREEN", isInputChecked);
  }
  setReportUnit(event, value) {
    this.setOption("REPORTUNITS", value);
  }
  render() {
    return (
      <MarxanDialog
        {...this.props}
        contentWidth={370}
        offsetY={80}
        showCancelButton={false}
        onOk={this.updateOptions.bind(this)}
        helpLink={"user.html#user-settings"}
        title="Settings"
        children={
          <div key="k14">
            <SelectField
              floatingLabelText={"Basemap style"}
              floatingLabelFixed={true}
              underlineShow={false}
              menuItemStyle={{ fontSize: "12px" }}
              labelStyle={{ fontSize: "12px" }}
              style={{ width: "260px" }}
              value={this.props.basemap}
              onChange={this.changeBasemap.bind(this)}
              children={this.props.basemaps.map((item) => {
                return (
                  <MenuItem
                    value={item.name}
                    key={item.name}
                    primaryText={item.alias}
                    style={{ fontSize: "12px" }}
                    title={item.description}
                  />
                );
              })}
            />
            <div style={{ paddingBottom: "10px" }}>
              <div className={"userSetting"}>Area units</div>
              <RadioButtonGroup
                name="reportUnitType"
                defaultSelected={this.props.userData.REPORTUNITS}
                onChange={this.setReportUnit.bind(this)}
              >
                <RadioButton
                  value="m2"
                  label="m2"
                  className={"radioButton"}
                  style={{ width: "60px", display: "inline-block" }}
                  inputStyle={{ width: "40px" }}
                  labelStyle={{ width: "40px" }}
                  iconStyle={{ marginRight: "3px" }}
                />
                <RadioButton
                  value="Ha"
                  label="Ha"
                  className={"radioButton"}
                  style={{ width: "60px", display: "inline-block" }}
                  inputStyle={{ width: "40px" }}
                  labelStyle={{ width: "40px" }}
                  iconStyle={{ marginRight: "3px" }}
                />
                <RadioButton
                  value="Km2"
                  label="Km2"
                  className={"radioButton"}
                  style={{ width: "60px", display: "inline-block" }}
                  inputStyle={{ width: "40px" }}
                  labelStyle={{ width: "40px" }}
                  iconStyle={{ marginRight: "3px" }}
                />
              </RadioButtonGroup>
            </div>
            {/*	<Checkbox label="Use feature colours" style={{fontSize:'12px'}} checked={this.props.userData.USEFEATURECOLORS} onCheck={this.toggleUseFeatureColors.bind(this)} />
						<Checkbox label="Show welcome screen at startup" style={{fontSize:'12px'}} checked={this.props.userData.SHOWWELCOMESCREEN} onCheck={this.toggleShowWelcomeScreen.bind(this)} />*/}
          </div>
        }
      />
    );
  }
}

export default UserSettingsDialog;
