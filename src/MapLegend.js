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
import { getMaxNumberOfClasses } from "./Helpers.js";
import LayerLegend from "./LayerLegend";

class MapLegend extends React.Component {
  //gets the summed solutions legend item
  getSummedSolution(layer, colorCode) {
    let items;
    //get the data value for the highest break in the data to see if we are viewing the sum solutions or an individual solution
    let summed =
      this.props.brew.breaks[this.props.brew.breaks.length - 1] === 1
        ? false
        : true;
    if (summed) {
      //get the number of classes the user currently has selected
      let numClasses = this.props.brew.getNumClasses();
      //get the maximum number of colors in this scheme
      let colorSchemeLength = getMaxNumberOfClasses(this.props.brew, colorCode);
      //get the color scheme
      let colorScheme = this.props.brew.colorSchemes[colorCode];
      //get the number of colors to show as an array
      let numClassesArray =
        numClasses <= colorSchemeLength
          ? Array.apply(null, {
              length: numClasses,
            }).map(Number.call, Number)
          : Array.apply(null, {
              length: colorSchemeLength,
            }).map(Number.call, Number);
      let classesToShow = numClassesArray.length;
      //get the legend items
      items = numClassesArray.map((item) => {
        //see if the data is a range - if the difference in the number of solutions is only 1, then it is not a range
        let range =
          this.props.brew.breaks[item + 1] - this.props.brew.breaks[item] > 1
            ? true
            : false;
        let suffix =
          this.props.brew.breaks[item + 1] === 1 ? " solution" : " solutions";
        let legendLabel = range
          ? this.props.brew.breaks[item] +
            1 +
            " - " +
            this.props.brew.breaks[item + 1] +
            suffix
          : this.props.brew.breaks[item + 1] + suffix;
        return {
          layer: layer,
          fillColor: colorScheme[classesToShow][item],
          strokeColor: "lightgray",
          label: legendLabel,
        };
      });
      //return the items
      return items;
    } else {
      //viewing a single solution rather than the sum solution
      return [
        {
          fillColor: "rgba(255, 0, 136,1)",
          strokeColor: "lightgray",
          label: "Proposed network",
        },
      ];
    }
  }

  render() {
    let layers = [];
    //get the planning grid shape
    this.planning_grid_shape =
      this.props.metadata &&
      this.props.metadata.PLANNING_UNIT_NAME &&
      this.props.metadata.PLANNING_UNIT_NAME.includes("hexagon")
        ? "hexagon"
        : "square";
    //move the costs layer to the end of the map legend - first see if it is present
    let costLayers = this.props.visibleLayers.filter(
      (item) => item.id === CONSTANTS.COSTS_LAYER_NAME
    );
    //cost layer present - move it to the end of the array
    if (costLayers.length) {
      //get the other layers
      layers = this.props.visibleLayers.filter(
        (item) => item.id !== CONSTANTS.COSTS_LAYER_NAME
      );
      //append the cost layer to the end
      layers.push(costLayers[0]);
    } else {
      layers = this.props.visibleLayers;
    }
    //get the legend items for non-feature layers
    let nonFeatureLegendItems = layers.map((layer) => {
      //get a unique key
      let key = "legend_" + layer.id;
      //create the legend for non-feature layers
      if (layer.metadata.type !== CONSTANTS.LAYER_TYPE_FEATURE_LAYER) {
        switch (layer.metadata.type) {
          case CONSTANTS.LAYER_TYPE_SUMMED_SOLUTIONS: //get the summed solutions legend
            let items =
              this.props.brew &&
              this.props.brew.breaks &&
              this.props.brew.colorCode
                ? this.getSummedSolution(layer, this.props.brew.colorCode)
                : [];
            return (
              <LayerLegend
                key={key}
                topMargin={"15px"}
                changeOpacity={this.props.changeOpacity}
                layer={layer}
                items={items}
                shape={this.planning_grid_shape}
                setSymbology={this.props.openClassificationDialog}
              />
            );
          case CONSTANTS.LAYER_TYPE_PLANNING_UNITS_COST:
            let minColor = layer.paint["fill-color"][3]; //min paint color
            let maxColor =
              layer.paint["fill-color"][layer.paint["fill-color"].length - 2]; //max paint color
            //if the min and max costs are the same only create a single legend item
            if (layer.metadata.min === layer.metadata.max) {
              return (
                <LayerLegend
                  key={key}
                  loading={this.props.costsLoading}
                  topMargin={"15px"}
                  changeOpacity={this.props.changeOpacity}
                  layer={layer}
                  items={[
                    {
                      fillColor: minColor,
                      strokeColor: "lightgray",
                      label: layer.metadata.min,
                    },
                  ]}
                  shape={this.planning_grid_shape}
                />
              );
            } else {
              return (
                <LayerLegend
                  key={key}
                  loading={this.props.costsLoading}
                  topMargin={"15px"}
                  changeOpacity={this.props.changeOpacity}
                  layer={layer}
                  items={[
                    {
                      fillColor: minColor,
                      strokeColor: "lightgray",
                      label: layer.metadata.min,
                    },
                    {
                      fillColor: maxColor,
                      strokeColor: "lightgray",
                      label: layer.metadata.max,
                    },
                  ]}
                  shape={this.planning_grid_shape}
                  range={true}
                />
              );
            }
          case CONSTANTS.LAYER_TYPE_PLANNING_UNITS_STATUS:
            //get the layers that will be subLayers in the legend
            let puLayer = layers.filter(
              (layer) => layer.id === CONSTANTS.PU_LAYER_NAME
            )[0];
            let puStatusLayer = layers.filter(
              (layer) => layer.id === CONSTANTS.STATUS_LAYER_NAME
            )[0];
            return (
              <LayerLegend
                key={key}
                topMargin={"15px"}
                changeOpacity={this.props.changeOpacity}
                layer={layer}
                subLayers={[puLayer, puStatusLayer]}
                items={[
                  CONSTANTS.PU_STATUS_DEFAULT,
                  CONSTANTS.PU_STATUS_LOCKED_IN,
                  CONSTANTS.PU_STATUS_LOCKED_OUT,
                ]}
                shape={this.planning_grid_shape}
              />
            );
          case CONSTANTS.LAYER_TYPE_PROTECTED_AREAS:
            return (
              <LayerLegend
                key={key}
                changeOpacity={this.props.changeOpacity}
                layer={layer}
                items={[
                  {
                    fillColor: "rgba(63,127,191)",
                    strokeColor: "lightgray",
                    label: "Marine",
                  },
                  {
                    fillColor: "rgba(99,148,69)",
                    strokeColor: "lightgray",
                    label: "Terrestrial",
                  },
                ]}
                shape={"square"}
              />
            );
          default:
            return null;
        }
      } else {
        return null;
      }
    });
    //get any feature legend items - these are combined into a single legend - first populate the legend items for each feature
    let featureLayers = layers.filter(
      (layer) => layer.metadata.type === CONSTANTS.LAYER_TYPE_FEATURE_LAYER
    );
    //populate the colors of the feature swatches and their labels
    let items = featureLayers.map((layer) => {
      return {
        fillColor: layer.paint["fill-color"],
        strokeColor: "lightgray",
        label: layer.metadata.name,
      };
    });
    //sort the items by label
    items.sort((a, b) => {
      if (a.label.toLowerCase() < b.label.toLowerCase()) return -1;
      if (a.label.toLowerCase() > b.label.toLowerCase()) return 1;
      return 0;
    });
    //now create the legend for features
    let featureLegendItems =
      items.length > 0 ? (
        <LayerLegend
          topMargin={"15px"}
          changeOpacity={this.props.changeOpacity}
          layer={{ metadata: { name: "Features" } }}
          subLayers={featureLayers}
          items={items}
          shape={"square"}
        />
      ) : null;
    //get any feature planning unit legend items - these are combined into a single legend - first populate the legend items for each feature planning unit
    let featurePUIDLayers = layers.filter(
      (layer) =>
        layer.metadata.type === CONSTANTS.LAYER_TYPE_FEATURE_PLANNING_UNIT_LAYER
    );
    //populate the colors of the feature planning grid swatches and their labels
    items = featurePUIDLayers.map((layer) => {
      return {
        fillColor: "none",
        strokeColor: layer.metadata.lineColor,
        label: layer.metadata.name,
      };
    });
    //now create the legend for feature planning grids
    let featurePUIDLegendItems =
      items.length > 0 ? (
        <LayerLegend
          topMargin={"15px"}
          changeOpacity={this.props.changeOpacity}
          layer={{ metadata: { name: "Planning units for features" } }}
          subLayers={featurePUIDLayers}
          items={items}
          shape={this.planning_grid_shape}
        />
      ) : null;
    return (
      <React.Fragment>
        {nonFeatureLegendItems}
        {featureLegendItems}
        {featurePUIDLegendItems}
      </React.Fragment>
    );
  }
}

export default MapLegend;
