/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import * as React from "react";
import TransparencyControl from "./TransparencyControl";
import Swatch from "./Swatch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import Sync from "material-ui/svg-icons/notification/sync";

class LayerLegend extends React.Component {
  constructor(props) {
    super(props);
    //set the initial opacity of the layer based on the layers paint property or for legends with subLayers, the first layers opacity
    let layer = this.props.hasOwnProperty("subLayers")
      ? this.props.subLayers[0]
      : this.props.layer;
    let opacity = 0;
    switch (layer.type) {
      case "fill":
        opacity = layer.paint["fill-opacity"];
        break;
      case "line":
        opacity = layer.paint["line-opacity"];
        break;
      default:
      // code
    }
    this.state = { opacity: opacity };
  }
  changeOpacity(opacity) {
    //set the state
    this.setState({ opacity: opacity });
    //the layer legend may in fact represent many separate layers (e.g. for features) - these are passed in as subLayers and each needs to have the opacity set
    if (this.props.hasOwnProperty("subLayers")) {
      this.props.subLayers.forEach((layer) => {
        this.props.changeOpacity(layer.id, opacity);
      });
    } else {
      //call the change opacity method on a single layer - this actually changes the opacity of the layer
      this.props.changeOpacity(this.props.layer.id, opacity);
    }
  }
  renderItems() {
    //iterate through the items in this layers legend
    return this.props.items.map((item, index) => {
      //get a unique key
      let key = "legend_" + this.props.layer.id + "_item_" + index;
      //if the legend is showing a range in values then put in a horizontal separator between the items
      let separator =
        this.props.range && index === 1 ? (
          <div className={"separator"}>-</div>
        ) : null;
      return (
        <div
          key={key}
          style={{ display: this.props.range ? "inline" : "block" }}
        >
          {separator}
          <Swatch item={item} key={key} shape={this.props.shape} />
          <div
            style={{
              display: "inline-flex",
              verticalAlign: "top",
              marginLeft: "7px",
              fontSize: "12px",
            }}
            key={key + "_label"}
          >
            {item.label}
          </div>
        </div>
      );
    });
  }
  render() {
    //get the items to render - if the layer is loading then get a spinner
    let items = this.props.loading ? (
      <Sync
        className="spin costsLayerSpinner"
        style={{ display: this.props.loading ? "inline-block" : "none" }}
        key={"costsspinner"}
      />
    ) : (
      this.renderItems()
    );
    //set symbology button
    let setSymbologyBtn = this.props.hasOwnProperty("setSymbology") ? (
      <FontAwesomeIcon
        className={"setSymbologyBtn"}
        icon={faCog}
        style={{ color: "gainsboro" }}
        onClick={this.props.setSymbology}
        title={"Configure symbology"}
      />
    ) : null;
    return (
      <React.Fragment>
        <div
          className={"tabTitle tabTitleInlineBlock"}
          style={{
            marginTop: this.props.hasOwnProperty("topMargin")
              ? this.props.topMargin
              : "unset",
          }}
          key={"legend_" + this.props.layer.id}
        >
          {this.props.layer.metadata.name}
        </div>
        {setSymbologyBtn}
        <TransparencyControl
          changeOpacity={this.changeOpacity.bind(this)}
          opacity={this.state.opacity}
        />
        <div>{items}</div>
      </React.Fragment>
    );
  }
}

export default LayerLegend;
