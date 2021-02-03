/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import * as React from "react";
import { List, ListItem } from "material-ui/List";
import TargetIcon from "./TargetIcon";
import { grey400 } from "material-ui/styles/colors";
import IconButton from "material-ui/IconButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import LinearGauge from "./LinearGauge";

class FeaturesList extends React.Component {
  iconClick(feature, evt) {
    this.props.openFeatureMenu(evt, feature);
  }
  updateTargetValue(targetIcon, newValue) {
    this.props.updateFeature(targetIcon.props.interestFeature, {
      target_value: newValue,
    });
  }
  itemClick(feature, evt) {
    if (evt.altKey) {
      //toggle the layers puid visibility
      feature.feature_puid_layer_loaded = !feature.feature_puid_layer_loaded;
      //add/remove it from the map
      this.props.toggleFeaturePUIDLayer(feature);
    } else {
      //toggle the layers visibility
      feature.feature_layer_loaded = !feature.feature_layer_loaded;
      //add/remove it from the map
      this.props.toggleFeatureLayer(feature);
    }
  }
  render() {
    return (
      <React.Fragment>
        <List
          style={{
            padding: "0px !important",
            maxHeight: this.props.maxheight,
            overflow: "auto",
          }}
        >
          {this.props.features.map((item) => {
            //get the total area of the feature in the planning unit
            let pu_area = item.pu_area;
            //TODO: This needs to be done differently when we are using the old version of Marxan because it does not have a value for the pu_area

            //get the protected percent
            let protected_percent =
              item.protected_area === -1
                ? -1
                : pu_area >= 0
                ? item.protected_area > 0
                  ? (item.protected_area / pu_area) * 100
                  : 0
                : 0;
            //this is a hack to round the protected percent as there are some bugs in Marxan that calculate the target area required wrongly
            //TODO - sort out
            // protected_percent = Math.round(protected_percent);
            let targetStatus =
              pu_area === 0
                ? "Does not occur in planning area"
                : protected_percent === -1
                ? "Unknown"
                : item.protected_area >= item.target_area
                ? "Target achieved"
                : "Target missed";
            return (
              <ListItem
                leftAvatar={
                  this.props.simple ? (
                    <span />
                  ) : (
                    <TargetIcon
                      style={{ left: 8 }}
                      target_value={item.target_value}
                      updateTargetValue={this.updateTargetValue.bind(this)}
                      interestFeature={item}
                      targetStatus={targetStatus}
                      visible={item.pu_area !== 0}
                      userRole={this.props.userRole}
                    />
                  )
                }
                primaryText={item.alias}
                secondaryText={
                  this.props.simple ? (
                    <span />
                  ) : (
                    <LinearGauge
                      scaledWidth={220}
                      target_value={item.target_value}
                      protected_percent={protected_percent}
                      visible={item.pu_area !== 0}
                      color={item.color}
                      useFeatureColors={this.props.useFeatureColors}
                      style={{
                        height: this.props.smallLinearGauge ? "3px" : "unset",
                      }}
                      smallLinearGauge={this.props.smallLinearGauge}
                    />
                  )
                }
                key={item.id}
                value={item.alias}
                onClick={
                  this.props.simple ? null : this.itemClick.bind(this, item)
                }
                rightIconButton={
                  this.props.simple ? (
                    <div />
                  ) : (
                    <IconButton
                      touch={true}
                      tooltipPosition="bottom-left"
                      onClick={this.iconClick.bind(this, item)}
                      style={{
                        width: "18",
                        height: "18",
                        padding: "10",
                        top: "10px",
                      }}
                      iconStyle={{ width: "18", height: "18" }}
                    >
                      <MoreVertIcon color={grey400} />
                    </IconButton>
                  )
                }
                innerDivStyle={{
                  padding: this.props.simple
                    ? "5px 5px 5px 5px"
                    : "6px 5px 2px 40px",
                }}
                style={{
                  borderRadius: "3px",
                  fontSize: "13px",
                  color: "rgba(0,0,0,0.8)",
                }}
              />
            );
          })}
        </List>
      </React.Fragment>
    );
  }
}

export default FeaturesList;
