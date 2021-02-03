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
import MapContainer2 from "./MapContainer2";
import FontAwesome from "react-fontawesome";

class PlanningGridDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = { expanded: false };
  }
  expand() {
    this.setState({ expanded: !this.state.expanded });
  }
  getProjectList() {
    this.props.getProjectList(
      this.props.planning_grid_metadata,
      "planning_grid"
    );
  }
  render() {
    let areaTD = this.props.planning_grid_metadata._area ? (
      <td className="metadataItemValue">
        {this.props.planning_grid_metadata._area}Km
        <span className="superscript">2</span>
      </td>
    ) : (
      <td />
    );
    // let country_idTD = (this.props.planning_grid_metadata.country_id) ? <td className='metadataItemValue'>{this.props.planning_grid_metadata.country_id}</td> : <td/>;
    return (
      <MarxanDialog
        {...this.props}
        onRequestClose={this.props.onCancel}
        showCancelButton={false}
        title={this.props.planning_grid_metadata.alias}
        helpLink={"user.html#the-planning-grid-details-window"}
        contentWidth={768}
        children={
          <React.Fragment key="k27">
            <MapContainer2
              planning_grid_metadata={this.props.planning_grid_metadata}
              getTilesetMetadata={this.props.getTilesetMetadata}
              setSnackBar={this.props.setSnackBar}
            />
            <div className="metadataPanel">
              <table>
                <tbody>
                  <tr>
                    <td colSpan="2" className="metadataItemTitle">
                      Description:
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="metadataItemValue2">
                      {this.props.planning_grid_metadata.description}
                    </td>
                  </tr>
                  <tr>
                    <td className="metadataItemTitle">Country:</td>
                    <td className="metadataItemValue">
                      {this.props.planning_grid_metadata.country}
                    </td>
                  </tr>
                  <tr>
                    <td className="metadataItemTitle">Domain:</td>
                    <td className="metadataItemValue">
                      {this.props.planning_grid_metadata.domain}
                    </td>
                  </tr>
                  <tr>
                    <td className="metadataItemTitle">Area:</td>
                    {areaTD}
                  </tr>
                  <tr>
                    <td className="metadataItemTitle">Unit count:</td>
                    <td className="metadataItemValue">
                      {this.props.planning_grid_metadata.planning_unit_count}
                    </td>
                  </tr>
                  <tr>
                    <td className="metadataItemTitle">Created:</td>
                    <td className="metadataItemValue">
                      {this.props.planning_grid_metadata.creation_date}
                    </td>
                  </tr>
                  <tr>
                    <td className="metadataItemTitle">Created by:</td>
                    <td className="metadataItemValue">
                      {this.props.planning_grid_metadata.created_by}
                    </td>
                  </tr>
                  <tr>
                    <td className="metadataItemTitle">Source:</td>
                    <td className="metadataItemValue">
                      {this.props.planning_grid_metadata.source}
                    </td>
                  </tr>
                  <tr
                    style={{
                      display: this.state.expanded ? "table-row" : "none",
                    }}
                  >
                    <td className="metadataItemTitle">aoi_id:</td>
                    <td className="metadataItemValue">
                      {this.props.planning_grid_metadata.aoi_id}
                    </td>
                  </tr>
                  {/*<tr style={{display:(this.state.expanded) ? 'table-row' : 'none'}}>
										<td className='metadataItemTitle'>country_id:</td>
										{country_idTD}
									</tr>
									<tr style={{display:(this.state.expanded) ? 'table-row' : 'none'}}>
										<td className='metadataItemTitle'>guid:</td>
										<td className='metadataItemValue'>{this.props.planning_grid_metadata.feature_class_name}</td>
									</tr>*/}
                  <tr
                    style={{
                      display: this.state.expanded ? "table-row" : "none",
                    }}
                  >
                    <td className="metadataItemTitle">tilesetid:</td>
                    <td className="metadataItemValue">
                      {this.props.planning_grid_metadata.tilesetid}
                    </td>
                  </tr>
                  <tr
                    style={{
                      display: this.state.expanded ? "table-row" : "none",
                    }}
                  >
                    <td className="metadataItemTitle">Projects:</td>
                    <td className="metadataItemValue">
                      <FontAwesome
                        name="external-link-alt"
                        onClick={this.getProjectList.bind(this)}
                        title="View a list of projects that this planning grid is used in"
                        style={{ cursor: "pointer", paddingTop: "6px" }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div
                onClick={this.expand.bind(this)}
                title={
                  this.state.expanded
                    ? "Show less details"
                    : "Show more details"
                }
                className={"textHyperlink"}
              >
                {this.state.expanded ? "less" : "more.."}
              </div>
              <div>You may need to zoom in to see the planning grid units</div>
            </div>
          </React.Fragment>
        }
      />
    ); //return
  }
}

export default PlanningGridDialog;
