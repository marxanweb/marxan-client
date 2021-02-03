/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import * as React from "react";
import mapboxgl from "mapbox-gl";
import SelectFieldMapboxLayer from "./SelectFieldMapboxLayer";

class PlanningUnitsDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = { planning_unit_grids_received: false };
  }
  componentDidMount() {
    let map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/blishten/cjg6jk8vg3tir2spd2eatu5fd", //north star + marine PAs in pacific
      center: [0, 0],
      zoom: 2,
    });
    this.setState({ map: map });
  }

  render() {
    return (
      <React.Fragment>
        <div className={"newPUDialogPane"}>
          <div>
            <div
              ref={(el) => (this.mapContainer = el)}
              className="absolute top right left bottom"
              style={{
                width: "352px",
                height: "300px",
                marginTop: "50px",
                marginLeft: "24px",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "380px",
                verticalAlign: "middle",
              }}
            >
              <SelectFieldMapboxLayer
                {...this.props}
                menuItemStyle={{ fontSize: "12px" }}
                labelStyle={{ fontSize: "12px" }}
                selectedValue={this.props.pu}
                map={this.state.map}
                mapboxUser={"blishten"}
                items={this.props.planning_unit_grids}
                changeItem={this.props.changeItem}
                disabled={!this.state.planning_unit_grids_received}
                width={"352px"}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PlanningUnitsDialog;
