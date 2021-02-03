/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import * as React from "react";
import { PieChart, Pie, Cell } from "recharts";
import Divider from "material-ui/Divider";
import { getArea } from "./Helpers.js";
// import star from './images/star.png';

class MetChart extends React.Component {
  render() {
    let rounded = Number(this.props.current_protected_percent.toFixed(1));
    let country_area = getArea(
      this.props.country_area,
      this.props.reportUnits,
      false
    );
    let protected_area = getArea(
      this.props.current_protected_area,
      this.props.reportUnits,
      false
    );
    let total_area = getArea(
      this.props.total_area,
      this.props.reportUnits,
      false
    );
    let titleText =
      "Total area: " +
      total_area +
      "\nCountry area: " +
      country_area +
      "\nProtected area: " +
      protected_area;
    const data = this.props.showCountryArea
      ? [
          { name: "Protected area", value: this.props.current_protected_area },
          {
            name: "Country area",
            value: this.props.country_area - this.props.current_protected_area,
          },
          {
            name: "Total area",
            value: this.props.total_area - this.props.country_area,
          },
        ]
      : [
          { name: "Protected area", value: this.props.current_protected_area },
          {
            name: "Total area",
            value: this.props.country_area - this.props.current_protected_area,
          },
        ];
    const colors = ["#D9D9D9", this.props.color];
    return (
      <React.Fragment>
        <div className="MetChart">
          <div className="MetChartTitle">{this.props.title}</div>
          <Divider />
          <div className="MetChartInner">
            <PieChart width={120} height={120}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                isAnimationActive={false}
                startAngle={90}
                endAngle={450}
                innerRadius={30}
                outerRadius={50}
              >
                {data.map((entry, index) => {
                  let _color;
                  switch (index) {
                    case 0:
                      _color = this.props.color;
                      break;
                    case 1:
                      _color = this.props.showCountryArea
                        ? "#bbbbbb"
                        : "#dddddd";
                      break;
                    default:
                      _color = "#dddddd";
                      break;
                  }
                  return <Cell key={index} fill={_color} strokeWidth={2} />;
                })}
              </Pie>
            </PieChart>
            <div style={{ color: colors[1] }} className="MetChartPercentLabel">
              {rounded}%
            </div>
            <div
              className="MetChartDiv"
              style={
                this.props.clickable !== false ? { cursor: "pointer" } : null
              }
              title={titleText}
            />
            {/*<span style={{display: (this.props.endemic && (this.props.created_by === "global admin")) ? 'inline' : 'none'}}><img src={star} alt="Endemic" title={"Endemic"} className={"endemicImg"}/></span>*/}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MetChart;
