/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import * as React from "react";
import MenuItem from "material-ui/MenuItem";
import SelectField from "material-ui/SelectField";

//this is a generic component for selecting and dynamically displaying a layer from mapbox on a mapbox map
//the following are property requirements:
// map:         the mapbox map where the layer will be displayed
// mapboxUser   the mapbox user id where the tilesets are stored, e.g. blished
// items:       the items that you want to display in the select box. these must contain the following properties:
//  alias               - a string for the text that will be shown in the select box
//  feature_class_name  - the actual value that determines which item is selected - this should be the tileset name, e.g. pupng_terrestrial_hexagon_50
//  envelope            - a well-known-text representation of the bounds of the mapbox layer, e.g. "POLYGON((60.4758290002083 29.3772500001874,60.4758290002083 38.4906960004201,74.8898619998315 38.4906960004201,74.8898619998315 29.3772500001874,60.4758290002083 29.3772500001874))" (optional)
// selectedValue the value that is selected (controlled from the controlling component)
//prerequisitives:
// request library

class SelectFieldMapboxLayer extends React.Component {
  changeItem(event, newValue) {
    //get the selected item
    let item = this.props.items[newValue];
    //zoom to the layer
    if (item.envelope !== null) {
      var envelope = this.getLatLngLikeFromWKT(item.envelope);
      this.props.map.fitBounds(envelope, {
        easing: function (num) {
          return 1;
        },
      });
    }
    // this.props.map.setPitch(60);
    //add the layer to the map
    this.addLayerToMap(item.feature_class_name);
    //update the state in the owner
    this.props.changeItem(item.feature_class_name);
  }

  getLatLngLikeFromWKT(wkt) {
    let envelope, returnVal;
    var parse = require("wellknown");
    var geometry = parse(wkt);
    //see if the envelope spans the dateline
    if (geometry.coordinates.length > 1) {
      //if the envelope spans the dateline then the first polygon is in the western hemisphere
      let west = parse(wkt).coordinates[0];
      let east = parse(wkt).coordinates[1];
      returnVal = [
        [east[0][1][0], east[0][1][1]],
        [west[0][1][0] + 360, west[0][1][1]],
      ];
    } else {
      envelope = parse(wkt).coordinates[0];
      returnVal = [
        [envelope[0][0], envelope[0][1]],
        [envelope[2][0], envelope[2][1]],
      ];
    }
    return returnVal;
  }

  //check the layer exists
  addLayerToMap(mapboxlayername) {
    this.mapboxlayername = mapboxlayername;
    var request = require("request");
    request(
      "https://api.mapbox.com/v4/" +
        this.props.mapboxUser +
        "." +
        mapboxlayername +
        ".json?access_token=" +
        this.props.registry.MBAT_PUBLIC +
        "&secure",
      this.parseUrlExists.bind(this)
    );
  }

  parseUrlExists(err, res) {
    let exists = res && res.statusCode === 200 ? true : false;
    if (exists) {
      //remove the previous planning unit layer
      let previousLayerId = this.props.map.getStyle().layers[
        this.props.map.getStyle().layers.length - 1
      ].id;
      //check it is a planning unit layer
      if (previousLayerId.substr(0, 3) === "pu_") {
        this.props.map.removeLayer(
          this.props.map.getStyle().layers[
            this.props.map.getStyle().layers.length - 1
          ].id
        );
      }
      //remove the source if it already exists
      if (this.props.map.getSource(this.props.mapboxUser)) {
        this.props.map.removeSource(this.props.mapboxUser);
      }
      //add the source for this layer
      this.props.map.addSource("blishten", {
        type: "vector",
        url: "mapbox://" + this.props.mapboxUser + "." + this.mapboxlayername,
      });
      //add the layer
      this.props.map.addLayer({
        id: this.mapboxlayername,
        type: "fill",
        source: this.props.mapboxUser,
        "source-layer": this.mapboxlayername,
        paint: {
          "fill-color": "#f08",
          "fill-opacity": 0.4,
        },
      });
    } else {
      console.log("The MapBox layer does not exist");
    }
  }

  render() {
    return (
      <React.Fragment>
        <SelectField
          onChange={this.changeItem.bind(this)}
          value={this.props.selectedValue}
          menuItemStyle={{ fontSize: "12px" }}
          labelStyle={{ fontSize: "12px" }}
          floatingLabelText="Select the planning units"
          floatingLabelFixed={true}
          style={{ width: this.props.width, verticalAlign: "middle" }}
        >
          {this.props.items.map((item) => {
            return (
              <MenuItem
                value={item.feature_class_name}
                primaryText={item.alias}
                key={item.feature_class_name}
                style={{ fontSize: "12px" }}
                menuItemStyle={{ fontSize: "12px" }}
                labelStyle={{ fontSize: "12px" }}
              />
            );
          })}
        </SelectField>
      </React.Fragment>
    );
  }
}

export default SelectFieldMapboxLayer;
