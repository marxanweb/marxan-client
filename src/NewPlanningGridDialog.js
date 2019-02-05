import * as React from "react";
import MarxanDialog from "./MarxanDialog";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import ToolbarButton from "./ToolbarButton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
let domains = ["Marine", "Terrestrial"];
let areakm2s = [10, 20, 30, 40, 50];
let shapes = ['Hexagon', 'Square'];

class NewPlanningGridDialog extends React.Component {
  changeIso3(evt, value) {
    this.props.changeIso3(this.props.countries[value].iso3);
  }
  changeDomain(evt, value) {
    this.props.changeDomain(domains[value]);
  }
  changeAreaKm2(evt, value) {
    this.props.changeAreaKm2(areakm2s[value]);
  }
  changeShape(evt, value) {
    this.props.changeShape(shapes[value]);
  }
  render() {
    let dropDownStyle = { width: "240px" };
    return (
      <MarxanDialog
        {...this.props}
        okDisabled={
          !this.props.iso3 ||
          !this.props.domain ||
          !this.props.areakm2 ||
          this.props.creatingNewPlanningGrid
        }
        cancelLabel={"Cancel"}
        showCancelButton={true}
        title="New Planning Grid"
        contentWidth={358}
        children={
          <React.Fragment key="k13">
            <div>
              <SelectField
                menuItemStyle={{ fontSize: "12px" }}
                labelStyle={{ fontSize: "12px" }}
                onChange={this.changeIso3.bind(this)}
                value={this.props.iso3}
                floatingLabelText="Area of interest"
                floatingLabelFixed={true}
              >
                {this.props.countries.map(item => {
                  return (
                    <MenuItem
                      style={{ fontSize: "12px" }}
                      value={item.iso3}
                      primaryText={item.original_n}
                      key={item.iso3}
                    />
                  );
                })}
              </SelectField> 
              <ToolbarButton
                icon={<FontAwesomeIcon icon={faArrowAltCircleUp} />}
                title="Load a custom area of interest from a shapefile (not currently implemented)"
                style={{position: 'absolute', top: '83px', right: '32px'}}
              />
            </div>
            <div>
              <SelectField
                menuItemStyle={{ fontSize: "12px" }}
                labelStyle={{ fontSize: "12px" }}
                onChange={this.changeDomain.bind(this)}
                value={this.props.domain}
                style={dropDownStyle}
                floatingLabelText="Domain"
                floatingLabelFixed={true}
              >
                {domains.map(item => {
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
                value={this.props.shape}
                style={dropDownStyle}
                floatingLabelText="Planning unit shape"
                floatingLabelFixed={true}
              >
                {shapes.map(item => {
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
                value={this.props.areakm2}
                style={dropDownStyle}
                floatingLabelText="Area of each planning unit"
                floatingLabelFixed={true}
              >
                {areakm2s.map(item => {
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
        onRequestClose={this.props.onCancel}
      />
    );
  }
}

export default NewPlanningGridDialog;
