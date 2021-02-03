/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import React from "react";
import mapboxgl from "mapbox-gl";

class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.resultsRendered = false;
  }
  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/light-v9",
      center: this.props.mapCentre,
      zoom: this.props.mapZoom,
      attributionControl: false,
      interactive: false,
    });
    this.map.on("load", (evt) => {
      evt.target.addLayer({
        id: this.props.RESULTS_LAYER_NAME,
        type: "fill",
        source: {
          type: "vector",
          url: "mapbox://" + this.props.tileset.id,
        },
        "source-layer": this.props.tileset.name,
        layout: {
          visibility: "none",
        },
      });
      this.map.setCenter(this.props.mapCentre);
      this.setMapZoom();
      if (!this.resultsRendered) this.renderResults();
      // this.map.setCenter(this.props.tileset.center);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.paintProperty !== prevProps.paintProperty) {
      if (this.props.paintProperty.length === 0) {
        //resetting the layout property
        this.map.setLayoutProperty(
          this.props.RESULTS_LAYER_NAME,
          "visibility",
          "none"
        );
      } else {
        //the solution has been loaded and the paint properties have been calculated - if the results layer (i.e. the planning unit grid layer) is loaded then render the results
        if (this.map.getLayer(this.props.RESULTS_LAYER_NAME)) {
          this.renderResults();
        } else {
          this.resultsRendered = false;
        }
      }
    }
    if (this.props.mapCentre !== prevProps.mapCentre) {
      this.map.setCenter(this.props.mapCentre);
    }
    if (this.props.mapZoom !== prevProps.mapZoom) {
      this.setMapZoom();
    }
  }

  //the results layer has been loaded and so the results can be rendered
  renderResults() {
    if (this.props.paintProperty.length === 0) return;
    this.map.setLayoutProperty(
      this.props.RESULTS_LAYER_NAME,
      "visibility",
      "visible"
    );
    this.map.setPaintProperty(
      this.props.RESULTS_LAYER_NAME,
      "fill-color",
      this.props.paintProperty.fillColor
    );
    this.map.setPaintProperty(
      this.props.RESULTS_LAYER_NAME,
      "fill-outline-color",
      this.props.paintProperty.oulineColor
    );
    this.map.setPaintProperty(
      this.props.RESULTS_LAYER_NAME,
      "fill-opacity",
      0.5
    );
    this.resultsRendered = true;
  }
  componentWillUnmount() {
    //remove the map and free all resources
    if (this.map) this.map.remove();
  }

  setMapZoom() {
    // this.map.setZoom(this.props.mapZoom - 3);
    this.map.setZoom(this.props.mapZoom);
  }

  render() {
    return (
      <div
        style={{ display: "inline-block", margin: "5px" }}
        onClick={
          this.props.disabled
            ? null
            : this.props.selectBlm.bind(this, this.props.blmValue)
        }
      >
        <div style={{ fontSize: "14px" }}>BLM: {this.props.blmValue}</div>
        <div
          ref={(el) => (this.mapContainer = el)}
          style={{
            width: "200px",
            height: "200px",
            cursor: this.props.disabled ? "default" : "pointer",
          }}
          className={"hoverMapContainer"}
          title={this.props.disabled ? "" : "Click to select this BLM value"}
        />
      </div>
    );
  }
}

export default MapContainer;
