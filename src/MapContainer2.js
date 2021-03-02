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
import { zoomToBounds } from "./Helpers.js";
//TODO: Combine this with MapContainer.js as they do similar things
class MapContainer2 extends React.Component {
  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/blishten/cjg6jk8vg3tir2spd2eatu5fd", //north star + marine PAs in pacific
      center: [0, 0],
      zoom: 2,
      attributionControl: false,
    });
    this.map.on("load", (evt) => {
      let color = this.props.color ? this.props.color : "rgba(255, 0, 0, 0.4)";
      let outlineColor = this.props.outlineColor
        ? this.props.outlineColor
        : "rgba(255, 0, 0, 0.5)";
      evt.target.addLayer({
        id: "planning_grid",
        type: "fill",
        source: {
          type: "vector",
          url: "mapbox://" + this.props.planning_grid_metadata.tilesetid,
        },
        "source-layer": this.props.planning_grid_metadata.feature_class_name,
        paint: {
          "fill-color": color,
          "fill-opacity": 0.9,
          "fill-outline-color": outlineColor,
        },
      });
    });
    this.props
      .getTilesetMetadata(this.props.planning_grid_metadata.tilesetid)
      .then((tileset) => {
        if (tileset.bounds != null) zoomToBounds(this.map, tileset.bounds);
      })
      .catch((error) => {
        this.props.setSnackBar(error);
      });
  }

  componentWillUnmount() {
    //remove the map and free all resources
    if (this.map) this.map.remove();
  }

  render() {
    return (
      <React.Fragment>
        <div className={"floatLeft mapContainer2"}>
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
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MapContainer2;
