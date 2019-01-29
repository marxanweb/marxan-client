import React from "react";
import MarxanDialog from "./MarxanDialog";

class AboutDialog extends React.Component {
  render() {
    return (
      <MarxanDialog
        {...this.props}
        contentWidth={530}
        offsetY={80}
        title="About"
        children={
          <div key="k5">
            <div style={{ fontSize: "14px" }}>
              Marxan Web v1.2 Feedback:{" "}
              <a href="mailto:andrew.cottam@ec.europa.eu" className="email">
                Andrew Cottam
              </a>
            </div>
            <div style={{ fontSize: "14px" }}>
              Marxan 2.4.3 - Ian Ball, Matthew Watts &amp; Hugh Possingham
            </div>
            <div style={{ fontSize: "14px" }}>
              With in-kind contributions from{" "}
              <a href="https://www.mapbox.com">Mapbox</a>
            </div>
            <img
              src="https://andrewcottam.github.io/cdn/mapbox_small.png"
              alt="Mapbox logo"
            />
          </div>
        }
      />
    );
  }
}

export default AboutDialog;
