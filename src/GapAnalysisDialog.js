/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import * as React from "react";
import MarxanDialog from "./MarxanDialog";
import MetChart from "./MetChart";
import {
  Cell,
  ReferenceLine,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
} from "recharts";
import Toggle from "material-ui/Toggle";
import CustomTooltip from "./CustomTooltip.js";

class GapAnalysisDialog extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { showChart: false };
  }
  getRepresentationScore(features) {
    let sum = 0,
      amount_under_protection_property,
      total_amount_property;
    //get the names of the properties that we will use to calculate the representation scores
    if (features.length) {
      if (features[0].hasOwnProperty("current_protected_area")) {
        amount_under_protection_property = "current_protected_area";
        total_amount_property = "country_area"; //should this be total_area or country_area?
      } else {
        amount_under_protection_property = "protected_area";
        total_amount_property = "pu_area";
      }
    }
    //iterate through the features and get the value for each feature
    features.forEach((item) => {
      let val =
        item[amount_under_protection_property] /
        item[total_amount_property] /
        (item.target_value / 100);
      if (!isNaN(val)) sum = sum + (val > 1 ? 1 : val);
    });
    //get the mean value
    let mean = sum / features.length;
    return Number(mean * 100).toFixed(1);
  }
  toggleView(event, isInputChecked) {
    this.setState({ showChart: isInputChecked });
  }
  renderTooltip(a, b, c) {
    return "wibble";
  }
  render() {
    //join the data from the gap analysis onto the feature data
    let _data = this.props.gapAnalysis.map((item) => {
      //get the matching projectFeatures item
      var stats = this.props.projectFeatures.filter((item2) => {
        return item2.feature_class_name === item._feature_class_name;
      })[0];
      if (stats) {
        return Object.assign(item, {
          target_value: stats.target_value,
          color: stats.color,
        });
      } else {
        return item;
      }
    });
    //sort the data by current protection
    _data.sort((a, b) => {
      let returnval =
        a.current_protected_percent < b.current_protected_percent ? -1 : 1;
      return returnval;
    });
    //get the data only for those features which occur in the country
    _data = _data.filter((item) => item.country_area > 0);
    //create the charts and get the count of features that have met the target
    let targetsMetCount = 0;
    let charts = _data.map((item, index) => {
      if (item.country_area > 0) {
        if (item.current_protected_percent >= item.target_value)
          targetsMetCount = targetsMetCount + 1;
        return (
          <MetChart
            {...item}
            title={item._alias}
            color={item.color}
            key={item._feature_class_name}
            reportUnits={this.props.reportUnits}
            showCountryArea={false}
            dataKey={item._feature_class_name}
          />
        );
      } else {
        return null;
      }
    });
    //get the representation score
    let score = this.props.gapAnalysis.length
      ? this.getRepresentationScore(_data)
      : "Calcuating..";
    return (
      <MarxanDialog
        showSpinner={this.props.preprocessing}
        autoDetectWindowHeight={false}
        {...this.props}
        contentWidth={680}
        title="Gap Analysis"
        helpLink={"user.html#gap-analysis-window"}
        onRequestClose={this.props.closeGapAnalysisDialog}
        showCancelButton={false}
        children={
          <React.Fragment key={"gapAnalysiskey"}>
            <div className="analysisReport">
              <div>
                Gap Analysis for {this.props.metadata.pu_country} using the{" "}
                {this.props.marxanServer.wdpa_version} version of the WDPA
              </div>
              <div
                className={"analysisReportInner"}
                style={{
                  display: this.props.gapAnalysis.length ? "block" : " none",
                }}
              >
                <div
                  className={"analysisChartsDiv"}
                  style={{ display: this.state.showChart ? "none" : "block" }}
                >
                  {charts}
                </div>
                <ComposedChart
                  width={550}
                  height={350}
                  data={_data}
                  margin={{ bottom: 20, top: 20 }}
                  style={{
                    display: this.state.showChart ? "block" : "none",
                    margin: "auto",
                  }}
                >
                  <CartesianGrid strokeDasharray="1" stroke="#f4f4f4" />
                  <XAxis
                    dataKey="_alias"
                    height={100}
                    angle={-90}
                    textAnchor="end"
                    dx={-5}
                  ></XAxis>
                  <YAxis tick={{ fontSize: 11 }}>
                    <Label
                      value="Percent Protected"
                      angle={-90}
                      position="insideBottomLeft"
                      style={{ fontSize: "11px", color: "#222222" }}
                      offset={30}
                    />
                  </YAxis>
                  <Tooltip
                    content={
                      <CustomTooltip reportUnits={this.props.reportUnits} />
                    }
                  />
                  <Bar dataKey="current_protected_percent" fill="#8884d8">
                    {_data.map((entry, index) => {
                      return <Cell fill={entry.color} key={entry.color} />;
                    })}
                  </Bar>
                  <ReferenceLine
                    y={_data.length ? _data[0].target_value : 0}
                    stroke="#7C7C7C"
                    strokeDasharray="3 3"
                    style={{ display: _data.length ? "inline" : "none" }}
                  />
                </ComposedChart>
                <div className={"gapAnalysisBtmPanel"}>
                  <div className={"gapAnalysisStatsPanel"}>
                    <table>
                      <tbody>
                        <tr>
                          <td>Features meeting targets:</td>
                          <td className={"score"}>
                            {targetsMetCount}/{charts.length}
                          </td>
                        </tr>
                        <tr>
                          <td>Representation score:</td>
                          <td className={"score"}>{score}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <Toggle
                    label="Show as a chart"
                    onToggle={this.toggleView.bind(this)}
                    style={{
                      width: "unset",
                      float: "right",
                      paddingTop: "2px",
                    }}
                    labelStyle={{
                      fontSize: "14px",
                      width: "100px",
                      color: "rgba(0, 0, 0, 0.6)",
                    }}
                    toggled={this.state.showChart}
                  />
                </div>
              </div>
            </div>
          </React.Fragment>
        }
      />
    );
  }
}

export default GapAnalysisDialog;
